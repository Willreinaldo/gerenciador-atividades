import React , {useState} from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';
import MenuIcon from '@mui/icons-material/Menu';
import { useUserAuth } from "../../context/UserAuthContext";

const Navbar = () => {
    const { logOut } = useUserAuth();

    async function handleLogout() {
        try {
            await logOut().then(console.log('logout!'));
        } catch {
            alert("Logout Error!")
        }
    } 
    const [showMenu, setShowMenu] = useState(false)
    return (
        <nav className='navbar'>
            <div className='nav-menu'>
                <div className='menu' id={showMenu ? "hidden" : ""}>
                    <Link className='links' to={'/'}>Solicitações</Link>
                    <Link className='links' to={'/New'}>Nova solicitação</Link>
                    <Link className='links' to={'/login'}    onClick={() => handleLogout()}>Sair  </Link> 
                </div>
                <button onClick={()=> setShowMenu(!showMenu) }>
                <MenuIcon/>
                </button>
            </div>    
        </nav>
    )
}

export default Navbar
