import { Link } from 'react-router-dom';
import "./Header.css";
import { adminModeSetter } from '../App';
import { useNavigate } from "react-router-dom";

function Header() {
    const { isAdmin, enableAdmin } = adminModeSetter();
    const navigate = useNavigate();

    const handleLogOut = () => {
        enableAdmin(false);
        navigate("/");
    }
    const resetScroll = () => {
        window.scrollTo(0, 0);
    }

    return (
        isAdmin ? (
            <header>
                <nav>
                    <p className="logout" onClick={handleLogOut}>Log Out</p>
                    <ul>
                        <li><Link to="/" className={"link-styles"} onClick={resetScroll}>Earn Coins</Link></li>
                        <li><Link to="/game-of-the-month" className={'link-styles'} onClick={resetScroll}>Game of the Month</Link></li>
                        <li><Link to="/prizes-manager" className={"link-styles"} onClick={resetScroll}>Prizes Manager</Link></li>
                        <li><Link to="/premium-prizes-manager" className={"link-styles"} onClick={resetScroll}>Premium Prizes Manager</Link></li>
                        <li><Link to="/prints-requests-manager" className={"link-styles"} onClick={resetScroll}>Prints Request Manager</Link></li>
                    </ul>
                </nav>
            </header>
        ) : (
            <header>
                <nav>
                    <ul>
                        <li><Link to="/" className={"link-styles"} onClick={resetScroll}>Earn Coins</Link></li>
                        <li><Link to="/game-of-the-month" className={'link-styles'} onClick={resetScroll}>Game of the Month</Link></li>
                        <li><Link to="/prizes" className={"link-styles"} onClick={resetScroll}>Prizes</Link></li>
                        <li><Link to="/custom-print" className={"link-styles"} onClick={resetScroll}>Custom Print</Link></li>
                        {/* <li><Link to="/premium-prizes" className={"link-styles"} onClick={resetScroll}>Premium Prizes</Link></li> */}
                        <li><Link to="/prints-queue" className={"link-styles"} onClick={resetScroll}>Prints Queue</Link></li>
                    </ul>
                </nav>
            </header>
        )
    )
}

export default Header;