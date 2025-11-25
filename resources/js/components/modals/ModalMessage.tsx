import { forwardRef, useRef, useEffect, useImperativeHandle, ReactNode } from "react";
import Modal from 'bootstrap/js/dist/modal.js';

interface MyInputProps {
  title?: string;
  children: ReactNode;
  icon?: string;
  okText: string;
  variant?: string;
  onOk?: () => void;
}

const modalMessage = forwardRef((props: MyInputProps, ref: React.Ref<Modal | null>) => {
  const { title, children, icon, okText, variant, onOk } = props;
  const modalRef = useRef<HTMLDivElement | null>(null);
  const modalInstanceRef = useRef<Modal | null>(null);

  useImperativeHandle(ref, () => modalInstanceRef.current as Modal, []);

  useEffect(() => {
    if (modalRef.current) {
      modalInstanceRef.current = new Modal(modalRef.current);
    }
  }, []);

  const onOkClick = () => {
    if (onOk) {
      onOk();
    }
    modalInstanceRef.current?.hide();
  };

  return (
    <div
      ref={modalRef}
      className="modal fade"
      tabIndex={-1}
      aria-hidden="true"
      style={{ marginTop: '0px', marginLeft: '0px', paddingLeft: '0px', zIndex: 10000 }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
            {title && <div className="modal-header">
                <div className="modal-body text-center p-5">
                    {icon && <i className={`w-16 h-16 text-theme-9 ${icon}`}></i>}
                    {title && <div className="text-3xl mt-5">{title}</div>}
                </div>
            </div>}
          <div className="modal-body p-0">
            {children}

            <div className="px-5 pb-8 text-center">
              <button
                type="button"
                className="btn btn-outline-secondary w-24 mr-1"
                onClick={() => modalInstanceRef.current?.hide()}
              >
                Cancelar
              </button>
              <button
                type="button"
                className={`btn btn-${variant ?? 'primary'} ${okText.length < 10 ? 'w-24' : ''}`}
                onClick={onOkClick}
              >
                {okText}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default modalMessage;
