import { CommandsManager, ExtensionManager } from '@ohif/core';
import styles from './utils/styles';
import callInputDialog from './utils/callInputDialog';
import MicroscopyViewportDownloadForm from "./components/MicroscopyViewportDownloadForm/MicroscopyViewportDownloadForm";

export default function getCommandsModule({
  servicesManager,
  commandsManager,
  extensionManager,
}: {
  servicesManager: AppTypes.ServicesManager;
  commandsManager: CommandsManager;
  extensionManager: ExtensionManager;
}) {
  const { viewportGridService, uiDialogService, microscopyService } = servicesManager.services;

  const actions = {
    // Measurement tool commands:
    deleteMeasurement: ({ uid }) => {
      if (uid) {
        const roiAnnotation = microscopyService.getAnnotation(uid);
        if (roiAnnotation) {
          microscopyService.removeAnnotation(roiAnnotation);
        }
      }
    },

    setLabel: ({ uid }) => {
      const roiAnnotation = microscopyService.getAnnotation(uid);

      callInputDialog({
        uiDialogService,
        defaultValue: '',
        callback: (value: string, action: string) => {
          switch (action) {
            case 'save': {
              roiAnnotation.setLabel(value);
              microscopyService.triggerRelabel(roiAnnotation);
            }
          }
        },
      });
    },

    setToolActive: ({ toolName, toolGroupId = 'MICROSCOPY' }) => {
      const dragPanOnMiddle = [
        'dragPan',
        {
          bindings: {
            mouseButtons: ['middle'],
          },
        },
      ];
      const dragZoomOnRight = [
        'dragZoom',
        {
          bindings: {
            mouseButtons: ['right'],
          },
        },
      ];
      if (
        ['line', 'box', 'circle', 'point', 'polygon', 'freehandpolygon', 'freehandline', 'arrow'].indexOf(
          toolName
        ) >= 0
      ) {
        // TODO: read from configuration
        const options = {
          geometryType: toolName,
          vertexEnabled: true,
          styleOptions: styles.default,
          bindings: {
            mouseButtons: ['left'],
          },
        } as any;
        if ('line' === toolName) {
          options.minPoints = 2;
          options.maxPoints = 2;
          options.markup = 'measurement';
        } else if ('arrow' === toolName) {
          options.minPoints = 2;
          options.maxPoints = 2;
          options.marker = 'arrow';
          // TODO: Investigate how to add the text (measurement) only after form submit
          // P.S.: after the zoom/resolution is fixed
          options.drawEndCallback = (callback: (value: string, action: string) => void) => {
            callInputDialog({
              uiDialogService,
              defaultValue: '',
              callback: callback,
            });
          };
        } else if ('point' === toolName) {
          delete options.styleOptions;
          delete options.vertexEnabled;
        }

        microscopyService.activateInteractions([
          ['draw', options],
          dragPanOnMiddle,
          dragZoomOnRight,
        ]);
      } else if (toolName == 'dragPan') {
        microscopyService.activateInteractions([
          [
            'dragPan',
            {
              bindings: {
                mouseButtons: ['left', 'middle'],
              },
            },
          ],
          dragZoomOnRight,
        ]);
      } else {
        microscopyService.activateInteractions([
          [
            toolName,
            {
              bindings: {
                mouseButtons: ['left'],
              },
            },
          ],
          dragPanOnMiddle,
          dragZoomOnRight,
        ]);
      }
    },
    toggleOverlays: () => {
      // overlay
      const overlays = document.getElementsByClassName('microscopy-viewport-overlay');
      let onoff = false; // true if this will toggle on
      for (let i = 0; i < overlays.length; i++) {
        if (i === 0) {
          onoff = overlays.item(0).classList.contains('hidden');
        }
        overlays.item(i).classList.toggle('hidden');
      }

      // overview
      const { activeViewportId } = viewportGridService.getState();
      microscopyService.toggleOverviewMap(activeViewportId);
    },
    toggleAnnotations: () => {
      microscopyService.toggleROIsVisibility();
    },
    rotateViewportCW: () => {
      const { activeViewportId } = viewportGridService.getState();
      microscopyService.rotateMap(activeViewportId, 90);
    },
    flipViewportHorizontal: () => {
      const { activeViewportId } = viewportGridService.getState();
      microscopyService.flipMapHorizontal(activeViewportId);
    },
    showDownloadViewportModal: () => {
      const { uiModalService } = servicesManager.services;

      if (uiModalService) {
        uiModalService.show({
          content: MicroscopyViewportDownloadForm,
          title: 'Download High Quality Image',
          contentProps: {
            onClose: uiModalService.hide,
          },
          containerDimensions: 'w-[50%] max-w-[700px]',
        });
      }
    },
  };

  const definitions = {
    deleteMeasurement: {
      commandFn: actions.deleteMeasurement,
    },
    setLabel: {
      commandFn: actions.setLabel,
    },
    setToolActive: {
      commandFn: actions.setToolActive,
    },
    toggleOverlays: {
      commandFn: actions.toggleOverlays,
    },
    toggleAnnotations: {
      commandFn: actions.toggleAnnotations,
    },
    rotateViewportCW: {
      commandFn: actions.rotateViewportCW,
    },
    flipViewportHorizontal: {
      commandFn: actions.flipViewportHorizontal,
    },
    showDownloadViewportModal: {
      commandFn: actions.showDownloadViewportModal,
    },
  };

  return {
    actions,
    definitions,
    defaultContext: 'MICROSCOPY',
  };
}
