import "./profile.css";
import LocationPinIcon from "@mui/icons-material/LocationPin";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import ReadMoreText from "../../components/readMoreText/ReadMoreText";
import HandshakeIcon from "@mui/icons-material/Handshake";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import { useState } from "react";
import Popup from "../../components/popup/Popup";
import FlagIcon from "@mui/icons-material/Flag";
import SaveAltIcon from "@mui/icons-material/SaveAlt";
import EmojiPopupContent from "../../components/emojiPopupContent/EmojiPopupContent";
import TaskIcon from "@mui/icons-material/Task";
import CommentIcon from "@mui/icons-material/Comment";
import VideoLibraryIcon from "@mui/icons-material/VideoLibrary";
import CollectionsIcon from "@mui/icons-material/Collections";
import AccessTimeFilledIcon from "@mui/icons-material/AccessTimeFilled";
import PublicIcon from "@mui/icons-material/Public";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

import "swiper/css/scrollbar";

// import required modules
import { Scrollbar } from "swiper/modules";

// import required modules
import { Pagination, Navigation } from "swiper/modules";
import { Link } from "react-router-dom";
import Header from "../../components/header/Header";

const Profile = () => {
  const [open, setOpen] = useState(false);

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
      imgs: ["general/images/wp.jpg"],
      vid: "",
      likes: 886,
      comment: 334,
      saves: 6743,
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
      saves: 98,
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
      imgs: [
        "general/images/wp.jpg",
        "general/images/wp.jpg",
        "general/images/wp.jpg",
      ],
      vid: "",
      likes: 9895,
      comment: 76,
      saves: 234,
      pub: "public",
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
      saves: 877,
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
      imgs: ["general/images/wp.jpg", "general/images/wp.jpg"],
      vid: "",
      likes: 35,
      comment: 76,
      saves: 897,
    },
  ];

  return (
    <>
      <Header/>
      <div className="profile">
        <div className="profileContainer">
          <div className="prCard">
            <img src="/general/images/wp.jpg" alt="" className="bgCoverImg" />
            <div className="profileImgBox">
              <img
                src="/general/images/franklin.jpg"
                alt=""
                className="profileImg"
              />
            </div>
            <div className="profileContainerTxt">
              <h2 className="lUsername">John Franklin</h2>
              <p className="lUserTitle">Full Stack Developer</p>
              <p className="lUserBio">
                Lorem ipsum dolor sit, amet consectetur adipisicing elit. Corrupti
                deleniti a non error vero perspiciatis quisquam. Ea dolore
                deserunt magnam?
              </p>
              <div className="lLocation">
                <div
                  style={{ fontSize: "small", color: "#443333", margin: "4px 0" }}
                >
                  <LocationPinIcon style={{ fontSize: "13px" }} /> Lagos
                </div>
                <span>500 connectins</span>
              </div>
            </div>
            <div className="profileButton">
              <button>
                <PersonAddIcon style={{ fontSize: "13px" }} />
                connect
              </button>
              <button>message</button>
              <div style={{ position: "relative", width: "100%" }}>
                <button onClick={() => setOpen(true)}>more</button>
                <Popup
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  // title="Confirm Action"
                >
                  {/* <button onClick={() => setOpen(false)}>OK</button> */}
                  <EmojiPopupContent />
                  <div className="popup-icons">
                    <SaveAltIcon style={{ fontSize: "13px" }} />
                    <p>Save to PDF</p>
                  </div>
                  <div className="popup-icons">
                    <FlagIcon style={{ fontSize: "13px" }} />
                    <p>Report/Block</p>
                  </div>
                </Popup>
              </div>
            </div>
          </div>
          <div className="prActivity" style={{ marginTop: "23px" }}>
            <h3>Activity</h3>
            <div className="activityBtns">
              <div className="activityBtn">
                <TaskIcon />
                Posts
              </div>
              <div className="activityBtn">
                <CommentIcon />
                Comments
              </div>
              <div className="activityBtn">
                <VideoLibraryIcon />
                Videos
              </div>
              <div className="activityBtn">
                <CollectionsIcon />
                Images
              </div>
            </div>
            <div className="activitySlide">
              <Swiper
                slidesPerView={3}
                spaceBetween={30}
                pagination={{ clickable: true }}
                modules={[Pagination]}
                className="mySwiper"
              >
                {contents.map((content) => (
                  <SwiperSlide key={content.id}>
                    <div className="middle">
                      <div className="middleContents">
                        {/* Header */}
                        <div className="middleHeader">
                          <div className="middleHeaderContent">
                            <Link to="/:profile">
                              <img
                                className="middleheaderUserImg"
                                src={content.userImg}
                                alt={content.username}
                              />
                            </Link>

                            <div className="middleHeaderTitle">
                              <h4>{content.username}</h4>
                              <p>{content.connections} connections</p>

                              <div style={{ display: "flex", gap: "10px" }}>
                                <div style={{ display: "flex" }}>
                                  <AccessTimeFilledIcon
                                    style={{ color: "#56687a", fontSize: "13px" }}
                                  />
                                  <span>{content.time}</span>
                                </div>
                                <PublicIcon
                                  style={{ color: "#56687a", fontSize: "13px" }}
                                />
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Body */}
                        <div className="middleBody">
                          <div className="middleBodyTxt">
                            <div className="truncateTxt">{content.task}</div>

                            <div
                              style={{ alignSelf: "flex-end", marginTop: "5px" }}
                            >
                              <span
                                className={
                                  content.status === "completed"
                                    ? "mbStatusCom"
                                    : content.status === "pending"
                                    ? "mbStatusPen"
                                    : "mbStatusLat"
                                }
                              >
                                {content.status}
                              </span>
                            </div>
                          </div>

                          {/* Images */}
                          {content.imgs.length > 0 && (
                            <div className="middleBodyImgs">
                              {content.imgs.length === 1 ? (
                                <img
                                  src={content.imgs[0]}
                                  alt=""
                                  className="middleBodyImg"
                                />
                              ) : (
                                <Swiper
                                  slidesPerView="auto"
                                  spaceBetween={20}
                                  scrollbar={{ hide: true }}
                                  modules={[Scrollbar]}
                                >
                                  {content.imgs.map((img, index) => (
                                    <SwiperSlide key={index}>
                                      <img
                                        src={img}
                                        alt=""
                                        className="middleBodyImg"
                                      />
                                    </SwiperSlide>
                                  ))}
                                </Swiper>
                              )}
                            </div>
                          )}

                          {/* Reactions */}
                          <div className="middleBodyReacts">
                            <div className="mdBodyIcons">
                              <span>{content.likes}</span>
                            </div>

                            <div className="mdComments">
                              <span>{content.comment} comments</span>
                              <span>{content.saves} saved</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
        <div className="profileRight">
          <div className="prBody">
            <div>
              <h3>More profiles for you</h3>
              <img
                src="/general/images/cartoonDP3.jpg"
                alt=""
                className="rBodyImg"
              />
              <div>
                <h5 className="rBodyTitle">Jane Doe</h5>
                <p className="rBodyPara">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil,
                  adipisci.
                </p>
                <div
                  style={{ display: "flex", marginTop: "7px", cursor: "pointer" }}
                >
                  <div className="rBodyFollowBtn">
                    <AddIcon />
                    Follow
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div>
              <img
                src="/general/images/cartoonDP3.jpg"
                alt=""
                className="rBodyImg"
              />
              <div>
                <h5 className="rBodyTitle">Jane Doe</h5>
                <p className="rBodyPara">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil,
                  adipisci.
                </p>
                <div
                  style={{ display: "flex", marginTop: "7px", cursor: "pointer" }}
                >
                  <div className="rBodyFollowBtn">
                    <AddIcon />
                    Follow
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div>
              <img
                src="/general/images/cartoonDP3.jpg"
                alt=""
                className="rBodyImg"
              />
              <div>
                <h5 className="rBodyTitle">Jane Doe</h5>
                <p className="rBodyPara">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil,
                  adipisci.
                </p>
                <div
                  style={{ display: "flex", marginTop: "7px", cursor: "pointer" }}
                >
                  <div className="rBodyFollowBtn">
                    <AddIcon />
                    Follow
                  </div>
                </div>
              </div>
              <hr />
            </div>
            <div>
              <img
                src="/general/images/cartoonDP3.jpg"
                alt=""
                className="rBodyImg"
              />
              <div>
                <h5 className="rBodyTitle">Jane Doe</h5>
                <p className="rBodyPara">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Nihil,
                  adipisci.
                </p>
                <div
                  style={{ display: "flex", marginTop: "7px", cursor: "pointer" }}
                >
                  <div className="rBodyFollowBtn">
                    <AddIcon />
                    Follow
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div></div>
        </div>
      </div>

    </>
  );
};

export default Profile;
