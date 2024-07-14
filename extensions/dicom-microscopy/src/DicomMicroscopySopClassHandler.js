import OHIF from '@ohif/core';

const { utils } = OHIF;

const SOP_CLASS_UIDS = {
  VL_WHOLE_SLIDE_MICROSCOPY_IMAGE_STORAGE: '1.2.840.10008.5.1.4.1.1.77.1.6',
};

const SOPClassHandlerId =
  '@ohif/extension-dicom-microscopy.sopClassHandlerModule.DicomMicroscopySopClassHandler';

function _getDisplaySetsFromSeries(instances, servicesManager, extensionManager) {
  // If the series has no instances, stop here
  if (!instances || !instances.length) {
    throw new Error('No instances were provided');
  }

  // TODO: Remove after figuring out why zoom is impossible if there is only one instance
  console.log('INSTANCES:', instances);

  const instance = instances[0];

  // Workaround for invalid (?) only one test file
  // TODO: Remove after fix of zoom in file with 1 instance
  if (instances.length === 1 && instance['7FDF1001']) {
    instance['7FDF1001'].forEach(element => {
      let clonedInstance = Object.assign({}, instance);
      for (let key in element) {
        if (Object.hasOwn(element, key)) {
          clonedInstance[key] = element[key];
        }
      }
      instances.push(clonedInstance);
    });
  }

  let singleFrameInstance = instance;
  let currentFrames = +singleFrameInstance.NumberOfFrames || 1;
  for (const instanceI of instances) {
    const framesI = +instanceI.NumberOfFrames || 1;
    if (framesI < currentFrames) {
      singleFrameInstance = instanceI;
      currentFrames = framesI;
    }
  }
  let imageIdForThumbnail = null;
  if (singleFrameInstance) {
    if (currentFrames == 1) {
      // Not all DICOM server implementations support thumbnail service,
      // So if we have a single-frame image, we will prefer it.
      imageIdForThumbnail = singleFrameInstance.imageId;
    }
    if (!imageIdForThumbnail) {
      // use the thumbnail service provided by DICOM server
      const dataSource = extensionManager.getActiveDataSource()[0];
      imageIdForThumbnail = dataSource.getImageIdsForInstance({
        instance: singleFrameInstance,
        thumbnail: true,
      });
    }
  }

  const {
    FrameOfReferenceUID,
    SeriesDescription,
    ContentDate,
    ContentTime,
    SeriesNumber,
    StudyInstanceUID,
    SeriesInstanceUID,
    SOPInstanceUID,
    SOPClassUID,
  } = instance;

  instances = instances.map(inst => {
    // NOTE: According to DICOM standard a series should have a FrameOfReferenceUID
    // When the Microscopy file was built by certain tool from multiple image files,
    // each instance's FrameOfReferenceUID is sometimes different.
    // Even though this means the file was not well formatted DICOM VL Whole Slide Microscopy Image,
    // the case is so often, so let's override this value manually here.
    //
    // https://dicom.nema.org/medical/dicom/current/output/chtml/part03/sect_C.7.4.html#sect_C.7.4.1.1.1

    inst.FrameOfReferenceUID = instance.FrameOfReferenceUID;

    return inst;
  });

  const othersFrameOfReferenceUID = instances
    .filter(v => v)
    .map(inst => inst.FrameOfReferenceUID)
    .filter((value, index, array) => array.indexOf(value) === index);
  if (othersFrameOfReferenceUID.length > 1) {
    console.warn(
      'Expected FrameOfReferenceUID of difference instances within a series to be the same, found multiple different values',
      othersFrameOfReferenceUID
    );
  }

  const displaySet = {
    plugin: 'microscopy',
    Modality: 'SM',
    altImageText: 'Microscopy',
    displaySetInstanceUID: utils.guid(),
    SOPInstanceUID,
    SeriesInstanceUID,
    StudyInstanceUID,
    FrameOfReferenceUID,
    SOPClassHandlerId,
    SOPClassUID,
    SeriesDescription: SeriesDescription || 'Microscopy Data',
    // Map ContentDate/Time to SeriesTime for series list sorting.
    SeriesDate: ContentDate,
    SeriesTime: ContentTime,
    SeriesNumber,
    firstInstance: singleFrameInstance, // top level instance in the image Pyramid
    instance,
    numImageFrames: 0,
    numInstances: 1,
    imageIdForThumbnail, // thumbnail image
    others: instances, // all other level instances in the image Pyramid
    othersFrameOfReferenceUID,
  };

  return [displaySet];
}

export default function getDicomMicroscopySopClassHandler({ servicesManager, extensionManager }) {
  const getDisplaySetsFromSeries = instances => {
    return _getDisplaySetsFromSeries(instances, servicesManager, extensionManager);
  };

  return {
    name: 'DicomMicroscopySopClassHandler',
    sopClassUids: [SOP_CLASS_UIDS.VL_WHOLE_SLIDE_MICROSCOPY_IMAGE_STORAGE],
    getDisplaySetsFromSeries,
  };
}
