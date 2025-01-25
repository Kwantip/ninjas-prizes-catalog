import { Link, useNavigate } from "react-router-dom";
import "./Footer.css";

import { adminModeSetter } from '../NinjasPrizesCatalog';
import { useState } from "react";

function Footer() {
    const { isAdmin, enableAdmin } = adminModeSetter();
    const navigate = useNavigate();
    const [superDuperSecretThing, setSuperDuperSecretThing] = useState(0);

    const handleLogOut = () => {
        enableAdmin(false);
        resetScroll();
        navigate("/");
    }
    const resetScroll = () => {
        window.scrollTo(0, 0);
        setSuperDuperSecretThing(0);
    }

    return(
        <footer>
            {isAdmin ? (
                <>
                    <Link to="/" className={"link-styles"} onClick={handleLogOut}>
                        <button>Log Out</button>
                    </Link>
                    <ul>
                        <li><Link to="/" className={"link-styles"} onClick={resetScroll}>Earn Coins</Link></li>
                        <li><Link to="/game-of-the-month" className="link-styles" onClick={resetScroll}>Game of the Month</Link></li>
                        <li><Link to="/prizes-manager" className={"link-styles"} onClick={resetScroll}>Prizes Manager</Link></li>
                        <li><Link to="/premium-prizes-manager" className={"link-styles"} onClick={resetScroll}>Premium Prizes Manager</Link></li>
                        <li><Link to="/prints-requests-manager" className={"link-styles"} onClick={resetScroll}>Prints Requests Manager</Link></li>
                    </ul>
                </>
            ) : (
                <>
                    {superDuperSecretThing === 3 ? (
                        <Link to="/admin-access" className={"link-styles"}>
                            <img onClick={resetScroll} src="src\assets\CodeNinjasLogoHorizontal_w_Outline.svg" />
                        </Link>
                    ) : (
                        <img onClick={() => setSuperDuperSecretThing(prev => prev + 1)} src="src\assets\CodeNinjasLogoHorizontal_1Color.svg" />
                    )}
                    <ul>
                        <li><Link to="/" className={"link-styles"} onClick={resetScroll}>Earn Coins</Link></li>
                        <li><Link to="/game-of-the-month" className="link-styles" onClick={resetScroll}>Game of the Month</Link></li>
                        <li><Link to="/prizes" className={"link-styles"} onClick={resetScroll}>Prizes</Link></li>
                        {/* <li><Link to="/premium-prizes" className={"link-styles"} onClick={resetScroll}>Premium Prizes</Link></li> */}
                        <li><Link to="/custom-print" className={"link-styles"} onClick={resetScroll}>Custom Print</Link></li>
                        <li><Link to="/prints-queue" className={"link-styles"} onClick={resetScroll}>Prints Queue</Link></li>
                    </ul>
                </>
            )}
            
            <p>♥ Designed & Implemented with love by Sensei Kwantip ♥</p>
        </footer>
    )
}

export default Footer;