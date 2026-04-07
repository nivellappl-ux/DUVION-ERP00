const fs = require('fs');

const files = [
    'src/views/pages/LoginPage.tsx',
    'src/views/pages/Dashboard.tsx'
];

files.forEach(f => {
    if (fs.existsSync(f)) {
        let c = fs.readFileSync(f, 'utf8');
        c = c.replace(/import \{ useNavigate \} from ['"]react-router['"];/g, 'import { useRouter } from "next/navigation";');
        fs.writeFileSync(f, c);
    }
});
