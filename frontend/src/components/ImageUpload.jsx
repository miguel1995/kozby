import { useState, useEffect } from 'react';
import { Upload } from 'antd';
import { InboxOutlined, DeleteOutlined } from '@ant-design/icons';
import { canAccess } from '../utils/authUtils';

const { Dragger } = Upload;

export const ImageUpload = ({ value, onChange }) => {
  const [previewUrl, setPreviewUrl] = useState(null);

  // Si value es una URL (string), mostrar esa URL
  // Si value es un File, crear URL local para preview
  useEffect(() => {
    if (!value) {
      setPreviewUrl(null);
      return;
    }

    // Si es una URL (string), usar directamente
    if (typeof value === 'string') {
      setPreviewUrl(value);
      return;
    }

    // Si es un File, crear URL local para preview
    if (value instanceof File) {
      const url = URL.createObjectURL(value);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url); // Limpiar URL cuando cambie
    }
  }, [value]);

  const handleChange = (info) => {
    const file = info.file.originFileObj || info.file;

    if (file) {
      // Guardar el archivo File en el estado
      onChange({ target: { name: 'imagen', value: file } });
    }
  };

  return (
    <div className="image-upload-container">
      {canAccess() && !previewUrl && (

        <Dragger
          beforeUpload={() => false} // Prevenir subida automática
          onChange={handleChange}
          showUploadList={false}
          accept="image/*"
          maxSize={1024}
        >
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            Haz clic o arrastra una imagen ( max 1MB )  aquí para subirla
          </p>
          <p className="ant-upload-hint">
            La imagen se subirá cuando guardes el producto
          </p>
        </Dragger>


      )}


      {previewUrl && (
        <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>



          <div style={{ marginTop: 16 }}>
            <img
              src={previewUrl}
              alt="Preview"
              style={{ maxWidth: '100%', maxHeight: 150, borderRadius: 8, objectFit: 'cover' }}
            />
          </div>
          <div
          >
            <div style={{ cursor: 'pointer', width: 'fit-content', padding: 8, borderRadius: 8, backgroundColor: '#f0f0f0',

              color: '#000000',
              fontSize: 32,
              fontWeight: 'bold',
             }}>
              <DeleteOutlined onClick={() => setPreviewUrl(null)} />

            </div>
          </div>

        </div>
      )}
    </div>
  );
};

