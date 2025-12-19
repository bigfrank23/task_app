import Header from '../../components/header/Header'
import './home.css'
import PublicIcon from '@mui/icons-material/Public';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import CloseIcon from '@mui/icons-material/Close';
import AccessTimeFilledIcon from '@mui/icons-material/AccessTimeFilled';
import AddIcon from '@mui/icons-material/Add';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import FavoriteIcon from '@mui/icons-material/Favorite';
import HandshakeIcon from '@mui/icons-material/Handshake';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import EditIcon from '@mui/icons-material/Edit';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import ReadMoreText from '../../components/readMoreText/ReadMoreText';
import CommentSection from '../../components/commentSection/commentSection';
import InfoIcon from '@mui/icons-material/Info';
import { useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Footer from '../../components/footer/Footer';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/scrollbar';

// import required modules
import { Scrollbar } from 'swiper/modules';

const Home = () => {
  const contents = [
    {
      id: 1,
      username: "James Almiron",
      userImg: "/general/images/cartoonDP.jpg",
      connections: 89,
      task: "Lorem ipsum dolor sit amet consectetur adipisicing elit.  Dolore praesentium architecto aspernatur possimus ea, asperiores nostrum illo sint veritatis et eligendi ipsum unde corporis quos atque minus commodi doloremque dignissimos.",
      status: "pending",
      originalStatus: "pending",
      time: "2pm",
      deadline: "12-12-2024",
      imgs: ["https://picsum.photos/200/300"],
      vid: "",
      likes: 886,
      comment: 334,
      saves: 6743
    },
    {
      id: 2,
      username: "Kelvin Harris",
      userImg: "/general/images/cartoonDP2.jpg",
      connections: 134,
      task: "Lorem ipsum dolor sit amet consectetur adipisicing elit.  Dolore praesentium architecto aspernatur possimus ea, asperiores nostrum illo sint veritatis et eligendi ipsum unde corporis quos atque minus commodi doloremque dignissimos.",
      status: "late",
      originalStatus: "late",
      time: "just now",
      deadline: "12-12-2024",
      imgs: [],
      vid: "",
      likes: 4,
      comment: 56,
      saves: 98
    },
    {
      id: 3,
      username: "Franklin",
      userImg: "/general/images/franklin.jpg",
      connections: 34,
      task: "Lorem ipsum dolor sit amet consectetur adipisicing elit.  Dolore praesentium architecto aspernatur possimus ea, asperiores nostrum illo sint veritatis et eligendi ipsum unde corporis quos atque minus commodi doloremque dignissimos.",
      status: "pending",
      originalStatus: "pending",
      time: "9:34pm",
      deadline: "12-12-2024",
      imgs: ["https://picsum.photos/200/300", "https://picsum.photos/200/300", "https://picsum.photos/200/300"],
      vid: "",
      likes: 9895,
      comment: 76,
      saves: 234,
      pub: "public"

    },
    {
      id: 4,
      username: "Jane Doe",
      userImg: "/general/images/cartoonDP3.jpg",
      connections: 898,
      task: "Lorem ipsum dolor sit amet consectetur adipisicing elit.  Dolore praesentium architecto aspernatur possimus ea, asperiores nostrum illo sint veritatis et eligendi ipsum unde corporis quos atque minus commodi doloremque dignissimos.",
      status: "pending",
      originalStatus: "pending",
      time: "9:49pm",
      deadline: "12-12-2024",
      imgs: [],
      vid: "",
      likes: 90,
      comment: 76,
      saves: 877
    },
    {
      id: 5,
      username: "Peter Hudson",
      userImg: "/general/images/user.jpg",
      connections: 675,
      task: "Lorem ipsum dolor sit amet consectetur adipisicing elit.  Dolore praesentium architecto aspernatur possimus ea, asperiores nostrum illo sint veritatis et eligendi ipsum unde corporis quos atque minus commodi doloremque dignissimos.",
      status: "completed",
      originalStatus: "completed",
      time: "5:23am",
      deadline: "12-12-2024",
      imgs: ["https://picsum.photos/200/300", "https://picsum.photos/200/300"],
      vid: "",
      likes: 35,
      comment: 76,
      saves: 897
    },
  ];

  const [showCommentSection, setShowCommentSection] = useState(false)

  const handleShowCommentSection = () => {
    setShowCommentSection(!showCommentSection)
  }
  

  return (
      <>
      <div className='box'>
        <Header/>
      <div className='home'>
        <div className="left">
          <div className="lTop">
            <img src="/general/images/wp.jpg" alt="" className="lbCoverImg" />
            <div className="lProfile">
              <img src="/general/images/franklin.jpg" alt="" className="lProfileImg" />
            </div>
            <h3 className="lUsername">John Franklin</h3>
            <p className="lUserTitle">Full Stack Developer</p>
            <p className="lUserBio">Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti deleniti a non error vero perspiciatis quisquam. Ea dolore deserunt magnam?</p>
            <div className="lLocation">
              <LocationPinIcon className='lLocationIcon'/>
              <span>New York, USA</span>
            </div>
        </div>
            <div className="lBottom">
              <div style={{display: "flex", justifyContent: "space-between", marginBottom: "5px"}}>
                <p>Profile View</p>
                <span>2</span>
              </div>
                
              <p>View all Analytics</p>
            </div>
        </div>
        <div className="middle">
            {
              contents.map((content) =>
            <div className='middleContents'>
              <div className="middleHeader">
                <div className='middleHeaderContent'>
                  <img className='middleheaderUserImg' src={content.userImg} alt="" />
                  <div className="middleHeaderTitle">
                    <h4>{content.username}</h4>
                    <p>{content.connections} connections</p>
                    <div style={{display: "flex", gap: "10px"}}>
                      <div style={{display: "flex"}}>
                        <AccessTimeFilledIcon style={{color: "#56687a", fontSize: "13px", alignSelf: "center"}} />
                        <span>{content.time}</span>
                      </div>
                      <PublicIcon style={{color: "#56687a", fontSize: "13px", alignSelf: "center"}}/>
                    </div>
                  </div>
                </div>
                <div className='middleHeaderIcons'>
                  <MoreHorizIcon style={{color: "#293138", fontSize: "16px", alignSelf: "center", cursor: "pointer"}} />
                  <CloseIcon style={{color: "#293138", fontSize: "16px", alignSelf: "center", cursor: "pointer"}} />
                </div>
              </div>
            <div className="middleBody">
              <div className="middleBodyTxt">
                <ReadMoreText limit={2} className={content.status === "completed" ? "completed" : content.status === "late" ? "late" : ""}>
                  {content.task}
                </ReadMoreText>
                <div style={{alignSelf: 'flex-end', marginTop: "5px"}}>
                  <span className={ content.status === "completed" ? 'mbStatusCom' :
                  content.status === "pending" ? "mbStatusPen" : "mbStatusLat"}>{content.status}</span>
                </div>
              </div>
              <div className={content.imgs.length === 0
              ? "removeMD" : "middleBodyImgs"}>
                  <>
                    {content.imgs.length === 1 && (
                      <img
                        src={content.imgs[0]}
                        alt=""
                        className="middleBodyImg"
                      />
                    )}

                    {content.imgs.length > 1 && (
                      <Swiper
                        slidesPerView="auto"
                        spaceBetween={30}
                        scrollbar={{
                        hide: true,
                      }}
                      modules={[Scrollbar]}
                        className="mySwiper"
                      >
                        {content.imgs.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img src={img} alt="" className="middleBodyImg" />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                    )}
                  </>
              </div>
              <div className="middleBodyReacts">
                <div className="mdBodyIcons">
                  <div className='handShakeIconBg'>
                    <HandshakeIcon style={{fontSize: "10px", color: "#fff", cursor: "pointer"}} />
                  </div>
                  <div className='heartIconBg'>
                    <FavoriteIcon style={{fontSize: "10px", color: "#f9f9f9", cursor: "pointer"}} />
                  </div>
                  <div className='likeIconBg'>
                    <ThumbUpIcon style={{fontSize: "10px", color: "#f9f9f9", cursor: "pointer"}} /> 
                  </div>
                  <span>{content.likes}</span>
                </div>
                <div className="mdComments">
                  <div style={{display: "flex"}}>
                    <ChatBubbleOutlineIcon style={{color: "#293138", fontSize: "10px", alignSelf: "center", cursor: "pointer"}}/>
                    <span>{content.comment} comments</span>
                  </div>
                  <div style={{display: "flex"}}>
                    <BookmarkBorderIcon style={{color: "#293138", fontSize: "10px", alignSelf: "center", cursor: "pointer"}}/>
                    <span>{content.saves} Saved</span>
                  </div>
                </div>
              </div>
              <div style={{display: "flex", justifyContent: "center"}}>
                <hr className="postDivider" />
              </div>
              <div className="mdReactAndComment">
                <div style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer"}}>
                  <ThumbUpOffAltIcon style={{fontSize: "14px"}}/>
                  <p>Like</p>
                </div>
                <div onClick={handleShowCommentSection} style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer"}}>
                  <ChatBubbleOutlineIcon style={{fontSize: "14px"}}/>
                  <p>Comment</p>
                </div>
                <div style={{display: "flex", gap: "3px", color: "#38434f", cursor: "pointer"}}>
                  <BookmarkBorderIcon style={{fontSize: "14px"}}/>
                  <p>Save</p>
                </div>
              </div>
              <div className={showCommentSection ? "commentSection" : "hideCommentSection"}>
                <CommentSection />
              </div>
            </div>
          </div>
              )
            }
        </div>
        <div className="right">
          <div className="rContent">
            <div>
              <div style={{display: "flex", justifyContent: "space-between"}}>
                <h2 className="rTitle">Recommended</h2>
                <div style={{display: "flex", flexDirection: "column"}}>
                  <InfoIcon style={{alignSelf: "center", fontSize: "14px"}} />
                  <span className='rRecomStat'>Added new task</span>
                </div>
              </div>
              <div className="rBody">
                  <img src="/general/images/cartoonDP3.jpg" alt="" className="rBodyImg" />
                <div>
                    <h5 className="rBodyTitle">Jane Doe</h5>
                    <p className="rBodyPara">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, adipisci.
                    </p>
                    <div style={{display: 'flex', marginTop: "7px", cursor: "pointer"}}>
                    <div className="rBodyFollowBtn">
                      <AddIcon/>
                      Follow
                    </div>
                    </div>
                </div>
              </div>
              <div className="rBody">
                  <img src="/general/images/cartoonDP2.jpg" alt="" className="rBodyImg" />
                <div>
                    <h5 className="rBodyTitle">Lewis Hudson</h5>
                    <p className="rBodyPara">
                      Lorem ipsum dolor sit amet.
                    </p>
                    <div style={{display: 'flex', marginTop: "7px", cursor: "pointer"}}>
                    <div className="rBodyFollowBtn">
                      <AddIcon/>
                      Follow
                    </div>
                    </div>
                </div>
              </div>
              <div className="rBody">
                  <img src="/general/images/cartoonDP3.jpg" alt="" className="rBodyImg" />
                <div>
                    <h5 className="rBodyTitle">Jane Doe</h5>
                    <p className="rBodyPara">
                      Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil, adipisci.
                    </p>
                    <div style={{display: 'flex', marginTop: "7px", cursor: "pointer"}}>
                    <div className="rBodyFollowBtn">
                      <AddIcon/>
                      Follow
                    </div>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
      </div>
      </>
  )
}

export default Home