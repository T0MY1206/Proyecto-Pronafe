<?php

namespace App\Http\Controllers\Admin;

use App\Constants\Rol;
use App\Http\Controllers\Controller;
use App\Models\Actualizacion;
use App\Models\Autoridad;
use App\Models\Cargo;
use App\Models\Dato;
use App\Models\Instituto;
use App\Models\Localidad;
use App\Models\Provincia;
use App\Models\User;
use App\Models\TipoInstituto;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class InstitutosController extends Controller
{
    public function index(Request $request)
    {
        $perPage = $request->query('limit', default: 15);

        $options = [
            'search' => $request->query('search'),
            'order' => $request->query('order', 'cue_editable'),
            'direction' => $request->query('direction', 'asc'),
        ];

        $filters = [
            'tipo_instituto_id' => $request->query('tipo_instituto_id'),
            'provincia_id' => $request->query('provincia_id')
        ];

        $ambito_gestion = $request->query('ambito_gestion');

        // Query filtrada, no se filtra por ambito de gestión para poder sacar las cantidades correctamente
        $institutosBaseQuery = Instituto::getInstitutosWithDescripcion($filters, $options['order'], $options['direction']);

        // Totales globales -- (DEPRECADO)
        $totalInstitutos = Instituto::count();
        $totalEstatales = Instituto::where('ambito_gestion', 'E')->count();
        $totalPrivados = Instituto::where('ambito_gestion', 'P')->count();

        // Totales filtrados (en base a la query con filtros)
        $totalFiltrado = $institutosBaseQuery->count();
        $totalEstatalesFilt = Instituto::getInstitutosWithDescripcion($filters)->where('ambito_gestion', 'E')->count();
        $totalPrivadosFilt = Instituto::getInstitutosWithDescripcion($filters)->where('ambito_gestion', 'P')->count();

        $provincias = Provincia::orderBy('descripcion')->get();
        $tiposInstituto = TipoInstituto::where('activo', true)->get();

        if (!empty($ambito_gestion)) //Si hay un ambito de gestión seleccionado
        {
            //Agrego el ambito de gestión a la query
            $institutosBaseQuery = $institutosBaseQuery->where('ambito_gestion', $ambito_gestion);
        }

        //Finalmente se pagina
        $institutosFiltrados = $institutosBaseQuery->paginate($perPage);

        return inertia('admin/Institutos/Index', [
            'institutos' => $institutosFiltrados,
            'provincias' => $provincias,
            'tiposInstituto' => $tiposInstituto,
            'options' => $options,
            'filters' => [
                'ambito_gestion' => $request->query('ambito_gestion', ''),
                'provincia_id' => $request->query('provincia_id', ''),
                'tipo_instituto_id' => $request->query('tipo_instituto_id', ''),
                'search' => $request->query('search', ''),
                'limit' => $perPage,
            ],
            'totales' => [
                'global' => [
                    'total' => $totalInstitutos,
                    'estatales' => $totalEstatales,
                    'privados' => $totalPrivados,
                ],
                'filtrados' => [
                    'total' => $totalFiltrado,
                    'estatales' => $totalEstatalesFilt,
                    'privados' => $totalPrivadosFilt,
                ],
            ],
        ]);
    }

    public function create()
    {

        $provincias = Provincia::getProvincias();
        $tiposDeInstitucion = TipoInstituto::getAll();

        return inertia('admin/Institutos/Create', [
            'provincias' => $provincias,
            'tiposDeInstitucion' => $tiposDeInstitucion,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'CUE' => 'required|numeric|unique:institutos',
            'nombre' => 'required|string|max:255',
            'ambito_gestion' => 'required|string|max:1',
            'tipo_instituto' => 'required|exists:tipo_institutos,id',
            'provincia' => 'nullable|exists:provincias,id',
            'departamento' => 'nullable|exists:departamentos,id',
            'localidad' => 'nullable|exists:localidades,id',
            'domicilio' => 'nullable|string|max:100',
            'codigo_postal' => 'nullable|numeric|digits:4',
            'telefono' => 'nullable|numeric|max_digits:20',
            'email' => 'required|email|max:255|unique:users,email',
        ]);

        $password = Str::random(10);

        //Crear el usuario y el instituto dentro de una transacción para evitar inconscistencias
        DB::beginTransaction();

        try {
            $instituto = Instituto::create([
                'cue' => $data['CUE'],
                'cue_editable' => $data['CUE'],
                'nombre' => $data['nombre'],
                'ambito_gestion' => $data['ambito_gestion'],
                'tipo_instituto_id' => $data['tipo_instituto'],
                'localidad_id' => $data['localidad'],
                'departamento_id' => $data['departamento'],
                'direccion' => $data['domicilio'],
                'codigo_postal' => $data['codigo_postal'],
                'telefono' => $data['telefono'],
                'email' => $data['email']
            ]);

            $user = User::create([
                'name' => $data['nombre'],
                'login_user_name' => $data['email'],
                'email' => $data['email'],
                'password' => $password,
                'rol_id' => Rol::INSTITUTO,
                'cue_instituto' => $data['CUE']
            ]);

            $instituto->update([
                'cue' => $instituto->cue,
                'user_id' => $user->id
            ]);

            Mail::to($data['email'])->send(new \App\Mail\NuevoInstitutoMail($user->name, $user->email, $password));

            DB::commit();
        } catch (\Exception $e) {
            DB::rollback();
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al crear el instituto: " . $e->getMessage()]);
            return redirect()->route('admin.institutos.create');
        }


        $request->session()->flash('toast', ['type' => 'success', 'text' => "Instituto creado correctamente"]);
        return redirect()->route('admin.institutos.index');
        //return redirect()->route('admin.institutos.create'); //Aca tendría que hacer redirect a la lista de institutos
    }

    public function edit($cue)
    {
        // Cargar instituto con sus relaciones (localidad -> departamento -> provincia)
        $instituto = Instituto::with('localidad.departamento.provincia')
            ->where('cue', $cue)
            ->firstOrFail();
        $tipoInstitutos = TipoInstituto::where('activo', true)->get();
        $localidad = Localidad::orderBy('descripcion')->get();
        $provincias = Provincia::orderBy('descripcion')->get();
        return inertia('admin/Institutos/Edit', compact('instituto', 'tipoInstitutos', 'provincias', 'localidad'));
    }

    public function updateInstituto(Request $request, Instituto $instituto)
    {
        // 🔹 Validación de entrada (debe estar fuera del try-catch para que Laravel maneje automáticamente los errores de validación)
        $validated = $request->validate([
            'tipo_instituto_id' => 'required|exists:tipo_institutos,id',
            'ambito_gestion' => 'nullable|in:P,E', // Privado / Estatal
            'departamento' => 'nullable|exists:departamentos,id',
            'localidad' => 'nullable|exists:localidades,id',
            'domicilio' => 'nullable|string|max:255',
            'codigo_postal' => 'nullable|string|max:10',
            'telefono' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:255',
            'anio_ingreso' => 'nullable|integer|min:1900|max:' . date('Y'),
            'anio_egreso' => 'nullable|integer|min:1900|max:' . (date('Y') + 1),
            'cue_editable' => [
                'nullable',
                'string',
                'min:9',
                'max:9',
                Rule::unique('institutos', 'cue_editable')->ignore($instituto->id),
            ],

        ], [
            'tipo_instituto_id.required' => 'El tipo de institución es obligatorio.',
            'tipo_instituto_id.exists' => 'El tipo de institución seleccionado no es válido.',
            'ambito_gestion.in' => 'El ámbito de gestión debe ser Estatal (E) o Privado (P).',
            'departamento.exists' => 'El departamento seleccionado no es válido.',
            'localidad.exists' => 'La localidad seleccionada no es válida.',
            'domicilio.string' => 'El domicilio debe ser un texto válido.',
            'domicilio.max' => 'El domicilio no puede exceder los 255 caracteres.',
            'codigo_postal.string' => 'El código postal debe ser un texto válido.',
            'codigo_postal.max' => 'El código postal no puede exceder los 10 caracteres.',
            'telefono.string' => 'El teléfono debe ser un texto válido.',
            'telefono.max' => 'El teléfono no puede exceder los 50 caracteres.',
            'email.email' => 'El correo electrónico debe tener un formato válido.',
            'email.max' => 'El correo electrónico no puede exceder los 255 caracteres.',
            'anio_ingreso.integer' => 'El año de ingreso debe ser un número.',
            'anio_ingreso.min' => 'El año de ingreso debe ser mayor o igual a 1900.',
            'anio_ingreso.max' => 'El año de ingreso no puede ser mayor al año actual.',
            'anio_egreso.integer' => 'El año de egreso debe ser un número.',
            'anio_egreso.min' => 'El año de egreso debe ser mayor o igual a 1900.',
            'anio_egreso.max' => 'El año de egreso no puede ser mayor al año siguiente.',
            'cue_editable.string' => 'El CUE debe ser un texto válido.',
            'cue_editable.min' => 'El CUE debe tener exactamente 9 caracteres.',
            'cue_editable.max' => 'El CUE debe tener exactamente 9 caracteres.',
            'cue_editable.unique' => 'Este CUE ya está en uso por otro instituto.',
        ]);

        try {
            // 🔹 Asignación de campos
            $instituto->fill([
                'tipo_instituto_id' => $validated['tipo_instituto_id'] ?? null,
                'ambito_gestion' => $validated['ambito_gestion'] ?? null,
                'departamento_id' => $validated['departamento'] ?? null,
                'localidad_id' => $validated['localidad'] ?? null,
                'direccion' => $validated['domicilio'] ?? null,
                'codigo_postal' => !empty($validated['codigo_postal'])
                    ? preg_replace('/\D+/', '', $validated['codigo_postal'])
                    : null,
                'telefono' => $validated['telefono'] ?? null,
                'email' => $validated['email'] ?? null,
                'anio_ingreso' => $validated['anio_ingreso'] ?? null,
                'anio_egreso' => $validated['anio_egreso'] ?? null,
                'cue_editable' => $validated['cue_editable'] ?? null,
            ]);

            if (!empty($validated['anio_egreso'])) {
                $instituto->activo = 0;
            }

            $instituto->save();

            return redirect()->route('admin.institutos.index')
                ->with('toast', [
                    'type' => 'success',
                    'text' => 'Instituto actualizado correctamente'
                ]);

        } catch (\Exception $e) {
            Log::error('Error al actualizar instituto: ' . $e->getMessage());
            $request->session()->flash('toast', [
                'type' => 'error',
                'text' => 'Error al actualizar el instituto'
            ]);

            return back()->withErrors(['error' => 'Error al actualizar el instituto']);
        }
    }


    public function update(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique(Instituto::class)->ignore($request->cue, 'cue')],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $Institutos = Instituto::where('cue', $request->cue)->firstOrFail();

        $password = $Institutos->password;

        $Institutos->fill($data);

        if ($request->filled('password')) {
            $Institutos->password = bcrypt($data['password']);
        } else {
            $Institutos->password = $password;
        }

        if ($Institutos->save()) {
            $request->session()->flash('toast', ['type' => 'success', 'text' => "Usuario actualizado correctamente"]);
        } else {
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al actualizar el usuario"]);
        }

        return redirect()->route('admin.institutos.index');
    }

    public function destroy($cue)
    {
        $instituto = Instituto::where('cue', $cue)->firstOrFail();
        $instituto->update(['activo' => '0']);

        return redirect()->route('admin.institutos.index')->with('toast', [
            'type' => 'success',
            'text' => "Instituto desactivado correctamente"
        ]);
    }
}
