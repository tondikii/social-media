import type {NextComponentType, NextPageContext} from "next";
import {useState, useMemo, useCallback, useEffect, useRef} from "react";
import {connect} from "react-redux";
import {useRouter} from "next/router";

import {likeUnLike as likeUnLikeProps} from "../store/actions";

import {CardMedia, Avatar, CardHeader} from "@mui/material";
import {Modal, Box, Divider, CardActions, IconButton} from "@mui/material";
import {
  HeartIcon,
  ShareIcon,
  ChatAltIcon,
  EmojiHappyIcon,
} from "@heroicons/react/outline";
import {HeartIcon as HeartIconSolid} from "@heroicons/react/solid";
import Carousel from "react-material-ui-carousel";
import EmojiPicker from "emoji-picker-react";

import styles from "../styles/ModalDetailPost.module.css";

interface Props {
  open: boolean;
  toggle: Function;
  data: {
    postId: string;
    User: {
      avatar: string;
      username: string;
    };
    files: string[];
    likes: string[];
    caption: string;
  };
  likeUnLike: Function;
  likeUnLikeState: {
    fetch: boolean;
    data: {
      postId: string;
      likes: string[];
    };
    error: string;
  };
}

const boxStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 1200,
  boxShadow: 24,
};

const steps = [
  {label: "Create new post", value: 1},
  {label: "Preview", value: 2},
  {label: "Create new post", value: 3},
];

const ModalCreate: NextComponentType<NextPageContext, {}, Props> = (
  props: Props
) => {
  const {
    open,
    toggle,
    data: {
      postId,
      User: {avatar = "", username = ""} = {},
      files = [
        "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png",
      ],
      caption,
      likes,
    } = {},
    likeUnLike,
    likeUnLikeState: {
      data: {postId: newPostId, likes: newLikes},
    },
  } = props;
  const router = useRouter();
  const textAreaRef = useRef<HTMLTextAreaElement>(null);

  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const usedLikes: string[] | undefined = useMemo(() => {
    if (postId === newPostId && newLikes?.length) {
      return newLikes;
    }
    return likes;
  }, [likes, newLikes, postId, newPostId]);

  const onClickLike = () => {
    setIsLiked(!isLiked);
    likeUnLike({
      accessToken: localStorage.getItem("accessToken"),
      data: {postId},
    });
  };

  const Content = useMemo(() => {
    const handleChangeCaption = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      setComment(e?.target?.value);
    };

    const onEmojiClick = (emojiObject: {emoji: string}) => {
      setComment((prevInput) => prevInput + emojiObject.emoji);
      setShowEmojiPicker(false);
    };
    return (
      <div className="flex flex-row">
        <div className="flex flex-col justify-center w-2/3">
          <Carousel indicators={files.length > 1 ? true : false}>
            {files.map((url, idx) => (
              <CardMedia
                component="img"
                height="194"
                image={url}
                alt="https://www.ruparupa.com/blog/wp-content/uploads/2022/05/sneaky-arts-main-2.jpg"
                key={idx}
              />
            ))}
          </Carousel>
        </div>
        <div
          className="flex flex-col p-4 justify-between"
          style={{width: 400, minHeight: 600}}
        >
          <div>
            <CardHeader
              avatar={
                <Avatar
                  aria-label="recipe"
                  src={
                    avatar ||
                    "https://trimelive.com/wp-content/uploads/2020/12/gambar-Wa-1.png"
                  }
                  className="cursor-pointer"
                  onClick={() => router.push(`/${username}`)}
                />
              }
              title={
                <span
                  className={`${styles.title} cursor-pointer`}
                  onClick={() => router.push(`/${username}`)}
                >
                  {username}
                </span>
              }
              subheader={
                <span className={`${styles.textSecondary} text-xs`}>
                  16 hours ago
                </span>
              }
            />
            <Divider className="dark:bg-zinc-400" />
          </div>
          <div className="vertical">
            <CardActions disableSpacing className="px-0">
              {isLiked ? (
                <IconButton
                  aria-label="add to favorites"
                  className="flex flex-row pl-0"
                  onClick={onClickLike}
                >
                  <HeartIconSolid className={`text-rose-600 h-5 w-5`} />
                  <span className={`${styles.text} ml-1`}>
                    {usedLikes?.length}
                  </span>
                </IconButton>
              ) : (
                <IconButton
                  aria-label="add to favorites"
                  className="flex flex-row pl-0"
                  onClick={onClickLike}
                >
                  <HeartIcon className={`${styles.text} h-5 w-5`} />
                  <span className={`${styles.text} ml-1`}>
                    {usedLikes?.length}
                  </span>
                </IconButton>
              )}
              <IconButton aria-label="add to favorites" className="mx-2">
                <ChatAltIcon className={`${styles.text} h-5 w-5`} />
                <span className={`${styles.text} ml-1`}>0</span>
              </IconButton>
              <IconButton aria-label="share" className="flex flex-row pl-0">
                <ShareIcon className={`${styles.text} h-5 w-5`} />
                <span className={`${styles.text} ml-1`}>0</span>
              </IconButton>
            </CardActions>
            <div className="horizontal justify-between">
              <textarea
                placeholder="Add a comment..."
                className={`${styles.textarea}`}
                value={comment}
                onChange={handleChangeCaption}
                ref={textAreaRef}
                rows={1}
              />
              <span className="text-primary font-semibold" role="button">
                Post
              </span>
            </div>
            <EmojiHappyIcon
              className="w-5 h-5 text-zinc-400"
              role="button"
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            />
            {showEmojiPicker && (
              <EmojiPicker theme="auto" onEmojiClick={onEmojiClick} />
            )}
          </div>
        </div>
      </div>
    );
  }, [files, username, avatar, comment, showEmojiPicker, router]);

  // Updates the height of a <textarea> when the value changes.
  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;

        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };

  useAutosizeTextArea(textAreaRef.current, comment);

  useEffect(() => {
    if (usedLikes) {
      const userId = localStorage.getItem("userId");
      const isFound = usedLikes.find((id) => id === userId);
      if (isFound) setIsLiked(true);
      else setIsLiked(false);
    }
  }, [usedLikes]);

  return (
    <Modal
      open={open}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
      onClose={() => toggle()}
      sx={{zIndex: 1059}}
    >
      <Box sx={{...boxStyle}} className="bg-white dark:bg-zinc-800 rounded-lg">
        {Content}
      </Box>
    </Modal>
  );
};

const mapStateToProps = (state: {
  rootReducer: {
    likeUnLike: Object;
  };
}) => ({
  likeUnLikeState: state.rootReducer.likeUnLike,
});

const mapDispatchToProps = {
  likeUnLike: (payload: {accessToken: string; data: {postId: string}}) =>
    likeUnLikeProps(payload),
};

export default connect(mapStateToProps, mapDispatchToProps)(ModalCreate);
