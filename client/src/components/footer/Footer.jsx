import "./footer.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';
import { TaskFlowIcon } from "../../utils/svgIcons";

const Footer = () => {
  return (
    <div className='footer'>
        <section className="logoSection">
            <h3 style={{display: 'flex', alignItems: 'center', justifyContent: 'center', textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)"}}>TaskFl<TaskFlowIcon size={15}/>w App</h3>
            <p style={{display: 'flex', alignItems: 'center', fontSize: "14px", marginTop: '10px'}}>Made with <FavoriteIcon style={{color: "red", fontSize: "16px"}}/> by Franklin</p>
        </section>
        <section className="footerDevImgSection">
            <img src="/general/images/franklin.jpg" alt="" className="footerDevImg" />
        </section>
        <section className="socialSection">
            <a href="https://wa.link/vyqzuo" target="_blank" rel="noreferrer"><WhatsAppIcon/></a>
            <a href="https://www.linkedin.com/in/franklin-ezeyim/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://github.com/franklinezeyim" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="mailto: ezeyimf@gmail.com" target="_blank" rel="noreferrer"><EmailIcon/></a>
        </section>
        <section className="copyrightSection">
            <p>© 2026 Franklin. All rights reserved.</p>
        </section>
    </div>
  )
}

export default Footer