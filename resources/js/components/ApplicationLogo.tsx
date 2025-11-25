export default function ({ width, height }: { width: number, height: number }) {
    return <img src="/assets/images/pronafe.jpg" className="w-16 h-16 rounded-full object-cover" style={{width: (width*3) + 'px', height: (height*3) + 'px'}} alt="Logo Pronafe" />;
}