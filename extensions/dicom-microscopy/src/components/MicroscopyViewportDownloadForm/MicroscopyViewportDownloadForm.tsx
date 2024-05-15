import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, ButtonEnums, Input, Typography, InputLabelWrapper, Select } from '@ohif/ui';
import { useTranslation } from 'react-i18next';

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

const MicroscopyViewportDownloadForm = ({
  onClose,
}) => {
  const { t } = useTranslation('Modals');
  const [filename, setFilename] = useState(DEFAULT_FILENAME);
  const [fileType, setFileType] = useState(['jpg']);
  const [error, setError] = useState({ filename: false });

  const hasError = Object.values(error).includes(true);
  const error_messages = { filename: 'The file name cannot be empty.' };

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
      <Typography
        className="mt-2 pl-1"
        color="error"
      >
        {error_messages[errorType]}
      </Typography>
    );
  };

  const downloadBlob = () => {
    const file = `${filename}.${fileType[0]}`;
    const canvas = document.querySelector(`.DicomMicroscopyViewer canvas`) as HTMLCanvasElement;

    const link = document.createElement('a');
    link.download = file;
    link.href = canvas.toDataURL(fileType[0], 1.0);
    link.click();
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

      <div className="mt-4 flex justify-end">
        <Button
          name="cancel"
          type={ButtonEnums.type.secondary}
          onClick={onClose}
        >
          {t('Cancel')}
        </Button>
        <Button
          className="ml-2"
          disabled={hasError}
          onClick={downloadBlob}
          type={ButtonEnums.type.primary}
          name={'download'}
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
