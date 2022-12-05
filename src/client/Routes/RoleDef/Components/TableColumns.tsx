import * as React from 'react';
import { IRoleDef, AllowedEntityStatusColor } from "Types/Domain";
import { Badge } from 'engage-ui';

import {
  getAllowedMemberType,
  getBadgeStatus,
  getStatus
} from '../../../Common/Utilities';

const nestedColumnConfig: Array<{}> = [
  {
    label: 'ID',
    key: 'id',
    className: ''
  },
  {
    label: 'Name',
    key: 'name',
    className: '',
    sortBy: 'keyword',
    style: { width: '160px' }
  },
  {
    label: 'Description',
    key: 'description',
    noSort: true,
    style: { width: '300px' }
  },
  {
    label: 'Status',
    key: 'entityState',
    style: { width: '120px' },
    sortBy: 'itemID',
    injectBody: (value: IRoleDef) => (
      <Badge
        working={value.processing}
        status={
          AllowedEntityStatusColor[value.processing ? 8 : getBadgeStatus(value)]
        }
      >
        {value.processing ? value.processing : getStatus(value)}
      </Badge>
    )
  },
  {
    label: 'Type',
    key: 'allowedMemberTypes',
    style: { width: '215px' },
    sortBy: 'itemID',
    injectBody: (value: IRoleDef) =>
      getAllowedMemberType(value.allowedMemberTypes)
  }
];

export default nestedColumnConfig;