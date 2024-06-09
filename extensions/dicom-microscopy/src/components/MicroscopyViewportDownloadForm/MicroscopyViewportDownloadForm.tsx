import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  ButtonEnums,
  Input,
  Typography,
  InputLabelWrapper,
  Select,
  CheckBox,
} from '@ohif/ui';
import { useTranslation } from 'react-i18next';
import html2canvas from 'html2canvas';

const DEFAULT_FILENAME = 'image';
const FILE_TYPE_OPTIONS = [
  {
    value: 'jpg',
    label: 'jpg',
  },
  {
    value: 'png',
    label: 'png',
  },
];

const MicroscopyViewportDownloadForm = ({ onClose }) => {
  const { t } = useTranslation('Modals');

  const canvases = document.querySelectorAll(
    `.DicomMicroscopyViewer canvas`
  ) as NodeListOf<HTMLCanvasElement>;
  const [showAnnotations, setShowAnnotations] = useState(canvases.length > 1);
  const previewRef = useRef(null);
  // Store the rendered preview with annotations to avoid time-consuming re-rendering
  const previewCanvasWithAnnotations = useRef(null);

  const [filename, setFilename] = useState(DEFAULT_FILENAME);
  const [fileType, setFileType] = useState(['jpg']);
  const [error, setError] = useState({ filename: false });

  const hasError = Object.values(error).includes(true);
  const error_messages = { filename: 'The file name cannot be empty.' };

  // Handle the preview canvas rendering
  useEffect(() => {
    previewRef.current.height = previewRef.current.width; // Make the preview square
    const context = previewRef.current.getContext('2d');

    const updateCanvas = (sourceCanvas: HTMLCanvasElement) => {
      context.clearRect(0, 0, previewRef.current.width, previewRef.current.height);
      context.drawImage(
        sourceCanvas,
        0,
        0,
        sourceCanvas.width,
        sourceCanvas.height,
        0,
        0,
        previewRef.current.width,
        previewRef.current.height
      );
    };

    if (showAnnotations) {
      if (!previewCanvasWithAnnotations.current) {
        // Generate the preview canvas with annotations
        html2canvas(document.querySelector(`.DicomMicroscopyViewer`)).then(sourceCanvas => {
          previewCanvasWithAnnotations.current = sourceCanvas;
          updateCanvas(sourceCanvas);
        });
      } else {
        // Show already generated preview canvas with annotations
        updateCanvas(previewCanvasWithAnnotations.current);
      }
    } else {
      // Show the original picture canvas
      const sourceCanvas = canvases[0] as HTMLCanvasElement;
      updateCanvas(sourceCanvas);
    }
  }, [canvases, showAnnotations]);

  // Handle the filename validation
  useEffect(() => {
    const hasError = {
      filename: !filename,
    };

    setError({ ...hasError });
  }, [filename]);

  const renderErrorHandler = errorType => {
    if (!error[errorType]) {
      return null;
    }

    return (
      <Typography className="mt-2 pl-1" color="error">
        {error_messages[errorType]}
      </Typography>
    );
  };

  const downloadBlob = () => {
    const file = `${filename}.${fileType[0]}`;

    const getDownloadableLink = (canvas: HTMLCanvasElement): HTMLElement => {
      const link = document.createElement('a');
      link.download = file;
      link.href = canvas.toDataURL(fileType[0], 1.0);
      return link;
    };

    if (showAnnotations) {
      html2canvas(document.querySelector(`.DicomMicroscopyViewer`)).then(canvas => {
        getDownloadableLink(canvas).click();
        onClose();
      });
    } else {
      getDownloadableLink(canvases[0]).click();
      onClose();
    }
  };

  return (
    <div>
      <Typography variant="h6">
        {t('Please specify the filename and desired type for the output image.')}
      </Typography>

      <div className="mt-5 flex">
        <div className="flex w-1/2">
          <div className="mb-4 w-full">
            <Input
              data-cy="file-name"
              value={filename}
              onChange={evt => setFilename(evt.target.value)}
              label={t('File Name')}
            />
            {renderErrorHandler('filename')}
          </div>
        </div>
        <div className="flex w-1/2">
          <div className="border-secondary-dark ml-6 w-full border-l pl-6">
            <div>
              <InputLabelWrapper
                sortDirection="none"
                label={t('File Type')}
                isSortable={false}
                onLabelClick={() => {}}
              >
                <Select
                  className="mt-2 text-white"
                  isClearable={false}
                  value={fileType}
                  data-cy="file-type"
                  onChange={value => {
                    setFileType([value.value]);
                  }}
                  hideSelectedOptions={false}
                  options={FILE_TYPE_OPTIONS}
                  placeholder="File Type"
                />
              </InputLabelWrapper>
            </div>
          </div>
        </div>
      </div>

      <CheckBox
        checked={showAnnotations}
        onChange={e => {
          if (canvases.length > 1) {
            // Checkbox component has no disabled state
            // So make changes only if there are annotations present
            setShowAnnotations(e);
          }
        }}
        label={t('Show Annotations')}
      />

      <div className="mt-4">
        <div
          className="bg-secondary-dark border-secondary-primary w-max-content min-w-full rounded p-4"
          data-cy="image-preview"
        >
          <Typography variant="h5">{t('Image preview')}</Typography>
          <canvas
            className="w-50 mx-auto my-2"
            ref={previewRef}
            style={{ border: '1px solid black' }}
          />
        </div>
      </div>

      <div className="mt-4 flex justify-end">
        <Button name="cancel" type={ButtonEnums.type.secondary} onClick={onClose}>
          {t('Cancel')}
        </Button>
        <Button
          className="ml-2"
          disabled={hasError}
          onClick={downloadBlob}
          type={ButtonEnums.type.primary}
          name="download"
        >
          {t('Download')}
        </Button>
      </div>
    </div>
  );
};

MicroscopyViewportDownloadForm.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default MicroscopyViewportDownloadForm;
