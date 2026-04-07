const fs = require('fs');

let f = 'src/views/layouts/DashboardLayout.tsx';
let c = fs.readFileSync(f, 'utf8');

c = c.replace(/import \{ Outlet, useNavigate, useLocation \} from ["']react-router["'];/g, 'import { useRouter, usePathname } from "next/navigation";');
c = c.replace(/const navigate = useNavigate\(\);/g, 'const router = useRouter();');
c = c.replace(/const location = useLocation\(\);/g, 'const pathname = usePathname();');
c = c.replace(/<Outlet \/>/g, '{children}');
c = c.replace(/export default function DashboardLayout\(\) \{/g, 'export default function DashboardLayout({ children }: { children: React.ReactNode }) {');
c = c.replace(/location\.pathname/g, 'pathname');
c = c.replace(/navigate\(/g, 'router.push(');

fs.writeFileSync(f, c);
