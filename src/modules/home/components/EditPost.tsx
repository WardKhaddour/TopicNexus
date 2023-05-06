import ReactDOM from 'react-dom';
import Backdrop from 'components/Backdrop';
import PrimaryButton from 'components/PrimaryButton';
import { useTranslation } from 'react-i18next';
import { FormEvent, MouseEvent, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import './EditPost.scss';
import FormInput from 'components/FormInput';
import Select, { ISelectionRef } from './Select';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from 'store';
import AttachFiles, { IAttachFiles } from './AttachFiles';
import { addNewPost } from '../store/actions';
import { notificationActions } from 'store/notification';

interface PostInputs {
  title: string;
  content: string;
}

const EditPost = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { t } = useTranslation();
  const methods = useForm<PostInputs>();
  const {
    handleSubmit,
    formState: { errors },
  } = methods;
  const [isFormShown, setIsFormShown] = useState(false);
  const { categories: allCategories } = useSelector(
    (state: RootState) => state.home
  );

  const [categoriesState, setCategoriesState] = useState({
    categories: allCategories.slice(0, 3),
    currentNum: 3,
  });

  const selectionRef = useRef<ISelectionRef>(null);
  const attachmentsRef = useRef<IAttachFiles>(null);

  const showFormHandler = (event: FormEvent) => {
    event.preventDefault();
    setIsFormShown(true);
  };
  const hideFormHandler = () => {
    setIsFormShown(false);
  };

  const preventCloseForm = (event: MouseEvent) => {
    event.stopPropagation();
  };

  const handleLoadCategories = async () => {
    setCategoriesState(prevState => {
      const newState = {
        categories: [
          ...prevState.categories,
          ...allCategories.slice(3, prevState.currentNum + 3),
        ],
        currentNum: prevState.currentNum + 3,
      };
      console.log(newState);

      return newState;
    });
  };

  const formSubmitHandler = handleSubmit(async data => {
    const categories = selectionRef.current?.getSelections();
    const attachments = attachmentsRef.current?.getAttachedFiles();

    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('content', data.content);
    categories?.forEach(cat => {
      formData.append('category', cat);
    });
    attachments?.forEach(attachment => {
      formData.append('attachments', attachment);
    });

    setIsFormShown(false);
    dispatch(
      notificationActions.setNotificationContent({
        message: t('msg.addingPost'),
        success: true,
      })
    );
    await dispatch(addNewPost(formData));
    selectionRef.current?.clearSelections();
    attachmentsRef.current?.clearAttachedFiles();
    methods.reset();
    setIsFormShown(false);
  });

  const backdropClasses = isFormShown ? '' : 'hidden';

  const titleInputClasses = `form-control__input ${
    errors.title?.message ? 'form-control__input--invalid' : ''
  }`;
  const contentInputClasses = `form-control__input ${
    errors.content?.message ? 'form-control__input--invalid' : ''
  }`;

  return (
    <>
      <form className="home__edit-post" onSubmit={showFormHandler}>
        <h3 className="home__edit-post--title">{t('label.addPost')}</h3>
        <PrimaryButton text={t('action.add')} type="submit" />
      </form>
      {ReactDOM.createPortal(
        <Backdrop className={backdropClasses} onClick={hideFormHandler}>
          <FormProvider {...methods}>
            <form
              className="edit-post__form"
              onClick={preventCloseForm}
              dir="auto"
              onSubmit={formSubmitHandler}
            >
              <h2 className="edit-post__form--title">{t('label.addPost')}</h2>
              <FormInput
                id="title"
                label={t('label.title')}
                validations={{
                  required: t('validateMsg.postTitleRequired'),
                }}
                isInvalidMessage={errors.title?.message}
                className={titleInputClasses}
              />
              <FormInput
                id="content"
                label={t('label.content')}
                inputFieldType="textarea"
                validations={{
                  required: t('validateMsg.postContentRequired'),
                }}
                isInvalidMessage={errors.content?.message}
                className={contentInputClasses}
              />
              <Select
                title={t('msg.selectCategories')}
                options={categoriesState.categories}
                ref={selectionRef}
              />
              {categoriesState.currentNum < allCategories.length && (
                <button
                  onClick={handleLoadCategories}
                  className="edit-post__form--load-categories"
                  type="button"
                >
                  {t('action.loadMoreCategories')}
                </button>
              )}
              <AttachFiles
                ref={attachmentsRef}
                primaryActionText={t('action.attachFiles')}
                secondaryActionText={t('action.remove')}
                filesLimit={3}
              />
              <PrimaryButton text={t('action.add')} type="submit" />
            </form>
          </FormProvider>
        </Backdrop>,
        document.getElementById('backdrop-root')!
      )}
    </>
  );
};

export default EditPost;
