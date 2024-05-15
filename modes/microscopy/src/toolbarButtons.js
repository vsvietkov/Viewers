import { ToolbarService } from '@ohif/core';

const toolbarButtons = [
  {
    id: 'MeasurementTools',
    uiType: 'ohif.splitButton',
    props: {
      groupId: 'MeasurementTools',
      // group evaluate to determine which item should move to the top
      evaluate: 'evaluate.group.promoteToPrimary',
      primary: ToolbarService.createButton({
        id: 'line',
        icon: 'tool-length',
        label: 'Line',
        tooltip: 'Line',
        commands: [
          {
            commandName: 'setToolActive',
            commandOptions: { toolName: 'line' },
            context: 'MICROSCOPY',
          },
        ],
        evaluate: 'evaluate.microscopyTool',
      }),
      secondary: {
        icon: 'chevron-down',
        tooltip: 'More Measure Tools',
      },
      items: [
        ToolbarService.createButton({
          id: 'line',
          icon: 'tool-length',
          label: 'Line',
          tooltip: 'Line',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'line' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'point',
          icon: 'tool-point',
          label: 'Point',
          tooltip: 'Point Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'point' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        // Point Tool was previously defined
        ToolbarService.createButton({
          id: 'polygon',
          icon: 'tool-polygon',
          label: 'Polygon',
          tooltip: 'Polygon Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'polygon' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'circle',
          icon: 'tool-circle',
          label: 'Circle',
          tooltip: 'Circle Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'circle' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'box',
          icon: 'tool-rectangle',
          label: 'Box',
          tooltip: 'Box Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'box' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'freehandpolygon',
          icon: 'tool-freehand-polygon',
          label: 'Freehand Polygon',
          tooltip: 'Freehand Polygon Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'freehandpolygon' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'freehandline',
          icon: 'tool-freehand-line',
          label: 'Freehand Line',
          tooltip: 'Freehand Line Tool',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'freehandline' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
        ToolbarService.createButton({
          id: 'arrow',
          icon: 'tool-annotate',
          label: 'Annotation',
          tooltip: 'Arrow Annotate',
          commands: [
            {
              commandName: 'setToolActive',
              commandOptions: { toolName: 'arrow' },
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.microscopyTool',
        }),
      ],
    },
  },
  {
    id: 'dragPan',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-move',
      label: 'Pan',
      commands: [
        {
          commandName: 'setToolActive',
          commandOptions: { toolName: 'dragPan' },
          context: 'MICROSCOPY',
        },
      ],
      evaluate: 'evaluate.microscopyTool',
    },
  },
  {
    id: 'Capture',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'tool-capture',
      label: 'Capture',
      commands: [
        {
          commandName: 'showDownloadViewportModal',
          context: 'MICROSCOPY',
        },
      ],
      evaluate: 'evaluate.action',
    },
  },
  {
    id: 'MoreTools',
    uiType: 'ohif.splitButton',
    props: {
      groupId: 'MoreTools',
      evaluate: 'evaluate.group.promoteToPrimaryIfCornerstoneToolNotActiveInTheList',
      primary: ToolbarService.createButton({
        id: 'RotateRight',
        icon: 'tool-rotate-right',
        label: 'Rotate Right',
        tooltip: 'Rotate Right +90',
        commands: [
          {
            commandName: 'rotateViewportCW',
            context: 'MICROSCOPY',
          },
        ],
        evaluate: 'evaluate.action',
      }),
      secondary: {
        icon: 'chevron-down',
        tooltip: 'More Tools',
      },
      items: [
        ToolbarService.createButton({
          id: 'RotateRight',
          icon: 'tool-rotate-right',
          label: 'Rotate Right',
          tooltip: 'Rotate Right +90',
          commands: [
            {
              commandName: 'rotateViewportCW',
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.action',
        }),
        ToolbarService.createButton({
          id: 'FlipHorizontal',
          icon: 'tool-flip-horizontal',
          label: 'Flip Horizontally',
          tooltip: 'Flip Horizontally',
          commands: [
            {
              commandName: 'flipViewportHorizontal',
              context: 'MICROSCOPY',
            },
          ],
          evaluate: 'evaluate.action',
        }),
      ],
    },
  },
  {
    id: 'TagBrowser',
    uiType: 'ohif.radioGroup',
    props: {
      icon: 'dicom-tag-browser',
      label: 'Dicom Tag Browser',
      commands: [
        {
          commandName: 'openDICOMTagViewer',
        },
      ],
      evaluate: 'evaluate.action',
    },
  },
];

export default toolbarButtons;
