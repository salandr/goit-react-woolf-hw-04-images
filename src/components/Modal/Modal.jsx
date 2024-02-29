import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Overlay, StyledModal } from './Modal.styled';

const portal = document.getElementById('portal');

const Modal = ({ closeModal, imgSrc, label }) => {
  const onOverlayClick = e => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  useEffect(() => {
    const onEscButtonClose = e => {
      if (e.code === 'Escape') {
        closeModal();
      }
    };

    window.addEventListener('keydown', onEscButtonClose);

    return () => {
      window.removeEventListener('keydown', onEscButtonClose);
    };
  }, [closeModal]);

  return createPortal(
    <Overlay onClick={onOverlayClick}>
      <StyledModal>
        <img src={imgSrc} alt={label} />
      </StyledModal>
    </Overlay>,
    portal
  );
};

export default Modal;

Modal.propTypes = {
  imgSrc: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
};
