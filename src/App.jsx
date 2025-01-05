import { createRoot } from 'react-dom/client';
import RootPage from './components/RootPage/RootPage';

const root = createRoot(document.querySelector("root"));

main();

function main() {
    root.render(<RootPage />);
}