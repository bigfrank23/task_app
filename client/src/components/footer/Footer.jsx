import "./footer.css";
import FavoriteIcon from '@mui/icons-material/Favorite';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import GitHubIcon from '@mui/icons-material/GitHub';
import EmailIcon from '@mui/icons-material/Email';

const Footer = () => {
  return (
    <div className='footer'>
        <section className="logoSection">
            <h3>Task App</h3>
            <p>Made with <FavoriteIcon style={{color: "red", fontSize: "16px", marginTop: "4px"}}/> by Franklin</p>
        </section>
        <section className="footerDevImgSection">
            <img src="/general/images/franklin.jpg" alt="" className="footerDevImg" />
        </section>
        <section className="socialSection">
            <a href="https://wa.me/2348135488233" target="_blank" rel="noreferrer"><WhatsAppIcon/></a>
            <a href="https://www.linkedin.com/in/franklin-ezeyim/" target="_blank" rel="noreferrer"><LinkedInIcon/></a>
            <a href="https://github.com/bigfrank23" target="_blank" rel="noreferrer"><GitHubIcon/></a>
            <a href="mailto: ezeyimf@gmail.com" target="_blank" rel="noreferrer"><EmailIcon/></a>
        </section>
        <section className="copyrightSection">
            <p>© 2025 Franklin. All rights reserved.</p>
        </section>
    </div>
  )
}

export default Footer