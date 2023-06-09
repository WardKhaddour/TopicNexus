import LoadingSpinner from 'components/LoadingSpinner';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import {
  addLike,
  deletePost,
  getCommentsOnPost,
  getPost,
  savePost,
} from './store/actions';
import { Link, useNavigate, useParams } from 'react-router-dom';
import CategoryItem from '../../components/CategoryItem';

import { ReactComponent as IconLike } from 'assets/icons/like.svg';
import { ReactComponent as IconLikeFilled } from 'assets/icons/like_filled.svg';
import { ReactComponent as IconComment } from 'assets/icons/comment.svg';
import { ReactComponent as IconSave } from 'assets/icons/save.svg';
import { ReactComponent as IconSaveFilled } from 'assets/icons/save_filled.svg';

import PostComments from './components/PostComments';
import './index.scss';
import replaceURLs from 'utils/validators/replaceURLs';
import PostAttachments from './components/PostAttachments';
import EditPost from '../../components/EditPost';
import { t } from 'i18next';
import { postDetailsActions } from './store';
import PostLikes from './components/PostLikes';

const PostDetails = () => {
  const [postsLoading, setPostsLoading] = useState(true);
  const [commentsShown, setCommentsShown] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const { postId } = useParams();
  const { post, comments, isLikesShown } = useSelector(
    (state: RootState) => state.home.postDetails
  );
  const { isAuthenticated, _id: userId } = useSelector(
    (state: RootState) => state.user.user
  );

  useEffect(() => {
    if (postId !== post?._id) {
      dispatch(getPost(postId!)).then(() => {
        setPostsLoading(false);
      });
    } else {
      setPostsLoading(false);
    }
  }, [dispatch, postId, post]);

  if (postsLoading) {
    return <LoadingSpinner loading={postsLoading} />;
  }

  const handleAddLike = async () => {
    await dispatch(addLike(postId!));
  };
  const toggleComments = async () => {
    setCommentsShown(prevState => !prevState);

    if (!comments || comments.length === 0 || comments[0].post !== postId)
      await dispatch(getCommentsOnPost(postId!));
  };

  const handleSavePost = async () => {
    await dispatch(savePost(postId!));
  };

  const handleDeletePost = async () => {
    await dispatch(deletePost(postId!));
    navigate(-1);
  };

  const handleViewPostLikes = () => {
    dispatch(postDetailsActions.setIsLikesShown(true));
  };

  return (
    <div className="post" dir="auto">
      {post?._id && isLikesShown && <PostLikes postId={post?._id} />}
      <div className="post__title-edit">
        <h2 className="post__title">{post?.title}</h2>
        {userId === post?.author._id && (
          <div className="post__actions">
            <EditPost post={post} edit />
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleDeletePost}
            >
              {t('action.delete')}
            </button>
          </div>
        )}
      </div>
      <h3 className="post__author">
        <span>By&nbsp;</span>
        <Link className="post__author--name" to={`/user/${post?.author._id}`}>
          <span>{post?.author.name}</span>
        </Link>
      </h3>
      <section className="post__date">
        <span>At&nbsp;</span>
        <span>{new Date(post?.publishedAt!).toLocaleDateString()}</span>
      </section>
      <section
        className="post__content"
        dangerouslySetInnerHTML={{ __html: replaceURLs(post?.content!) }}
      ></section>
      {post?.category && post.category.length > 0 && (
        <section className="post__categories">
          <span className="post__categories--title">Post Categories:</span>
          <span className="post__categories--list">
            {post?.category.map(cat => (
              <CategoryItem name={cat.name} key={cat._id} />
            ))}
          </span>
        </section>
      )}
      {post?.attachments && (
        <PostAttachments
          attachments={post.attachments}
          authorId={post.author._id}
          postId={post._id}
        />
      )}
      {isAuthenticated && (
        <section className="post__action">
          <div className="post__action--like">
            <button className="post__action--button" onClick={handleAddLike}>
              {post?.isLiked ? (
                <IconLikeFilled className="post__action--icon post__action--icon-filled" />
              ) : (
                <IconLike className="post__action--icon " />
              )}
            </button>
            <button
              className="post__action--likes"
              onClick={handleViewPostLikes}
            >
              {post?.likesNum}
            </button>
          </div>
          <div className="post__action--comment">
            <button className="post__action--button" onClick={toggleComments}>
              <IconComment className="post__action--icon" />
            </button>
            <span>{post?.commentsNum}</span>
          </div>
          <button className="post__action--button" onClick={handleSavePost}>
            {post?.isSaved ? (
              <IconSaveFilled className="post__action--icon post__action--icon-filled" />
            ) : (
              <IconSave className="post__action--icon " />
            )}
          </button>
        </section>
      )}
      {isAuthenticated && commentsShown && <PostComments postId={postId!} />}
    </div>
  );
};

export default PostDetails;
