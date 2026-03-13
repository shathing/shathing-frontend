export default function Header() {
  return (
    <header className="h-12 w-full flex justify-center bg-red-400">
      <div className="w-full max-w-5xl flex items-center justify-between px-4">
        <div>Home</div>
        <nav>
          <ul className="flex gap-5">
            <li>link1</li>
            <li>link2</li>
            <li>link3</li>
          </ul>
        </nav>
        <div>Login</div>
      </div>
    </header>
  );
}
