import Link from 'next/link';

export default function Navbar() {
  return (
    <div className="navbar bg-base-100 shadow-lg">
      <div className="flex-1 text-center">
        <h1>Task Assignment System</h1>
      </div>
      <div className="flex-none">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/tasks">Tasks</Link>
          </li>
          <li>
            <Link href="/tasks/create">Create Task</Link>
          </li>
        </ul>
      </div>
    </div>
  );
}