<?php
namespace App\Http\Controllers\Admin;

use App\Constants\Rol;
use App\Http\Controllers\Controller;
use App\Models\Provincia;
use App\Models\User;
use App\Models\Rol as RolModel;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class UsersController extends Controller {

    public function index(Request $request) {
        $order = $request->query('order', 'id');
        $direction = $request->query('direction', 'asc');
        $search = $request->query('search', '');

        $query = User::query();

        if ($search) {
            $query->where('name', 'like', "%$search%")
                  ->orWhere('email', 'like', "%$search%");
        }

        $query->orderBy($order, $direction);

        $users = $query->paginate(15)->withQueryString();

        $options = [
            'order' => $order,
            'direction' => $direction,
            'search' => $search,
            'path' => $users->path(),
            'per_page' => $users->perPage(),
        ];

        // El administrador puede ver todos los usuarios del sistema
        $users = User::getAllUsers($options)->paginate();


        return inertia('admin/Users/Index', [
            'users' => $users,
            'options' => $options,
        ]);
    }

    public function create() {
        $roles = RolModel::all();
        $provincias = Provincia::all();

        return inertia('admin/Users/Create', [
            'roles' => $roles,
            'provincias' => $provincias
        ]);
    }

    public function store(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|string|email|max:255',
            'login_user_name' => 'required|string|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'rol_id' => 'required|integer|exists:roles,id',
            'provincia_id' => 'nullable|integer|exists:provincias,id'
        ]);

        User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'login_user_name' => $data['login_user_name'],
            'password' => bcrypt($data['password']),
            'rol_id' => $data['rol_id'],
            'provincia_id' => $data['provincia_id']
        ]);

        $request->session()->flash('toast', ['type' => 'success', 'text' => "Usuario guardado correctamente"]);

        return redirect()->route('admin.users.index');
    }

public function edit($id)
{
    $user = User::findOrFail($id);
    $provincias = Provincia::all();
    $roles = RolModel::all();

    return inertia('admin/Users/Edit', [
        'user' => $user,
        'provincias' => $provincias,
        'roles' => $roles,
    ]);
}


    public function update(Request $request) {
        $data = $request->validate([
            'name' => 'required|string|max:100',
            'login_user_name' => ['required', 'string', 'max:255', Rule::unique(User::class)->ignore($request->id)],
            'email' => ['required' , 'string', 'email', 'max:255'],
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        $user = User::findOrFail($request->id);

        $password = $user->password;

        $user->fill( $data );

        if($request->filled('password')) {
            $user->password = bcrypt($data['password']);
        } else {
            $user->password = $password;
        }

        if($user->save()) {
            $request->session()->flash('toast', ['type' => 'success', 'text' => "Usuario actualizado correctamente"]);
        } else {
            $request->session()->flash('toast', ['type' => 'error', 'text' => "Error al actualizar el usuario"]);
        }

        return redirect()->route('admin.users.index');
    }
}
