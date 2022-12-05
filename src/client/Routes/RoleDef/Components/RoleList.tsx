import * as React from 'react';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';
import { classNames } from '@shopify/react-utilities/styles';

import { AllowedEntityStatusColor } from 'Types/Domain';
import { IRoleDef } from 'Types/Domain';

import DrawerSpinner from '../../../Common/Components/DrawerSpinner';

import {
  Badge,
  Button,
  Checkbox,
  Dropdown,
  FlexBox,
  Column,
  Heading,
  Table,
  TextField
} from 'engage-ui';

import {
  getAllowedMemberType,
  getBadgeStatus,
  getStatus
} from '../../../Common/Utilities';

import { RoleListState } from './RoleListState';
import { RoleListProp } from './RoleListProp';
import { ROLE } from '../../../ThemeIdentifiers';
import useAppDispatch from 'store/hooks/useAppDispatch';
import { getRoles } from 'store/rolesSlice/rolesSlice';
import debounce from 'helpers/debounce';
import useAppSelector from 'store/hooks/useAppSelector';
import queries from 'constants/queries';

const baseTheme = require('../Styles/RoleList.scss');
const TableStyle = require('../../../Theme/Table.scss');
const CommonStyle = require('../../../Theme/ListTheme.scss');

/*
  label: Table header lable which will be visible
  key: Match it with json data, this will help to get specific value from the data
  headerValue: In case of custom component, if any value is required, here it can be stored
  classname: any custom classname, this can be used to set width or any other style
  style: same like class but for inline styling
  noSort: if sorting="all" & we want to disable sorting of specifc column
  sort: Enable sorting for specific column
  injectBody: To inject custom component in td
  injectHeader: To inject custom component in th
*/

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

/**
 * Component to display role def list & show different actions like filter, delete, individual actions
 */

const RoleListComponent = ({ roleDefs, theme }: RoleListProp) => {
  const dispatch = useAppDispatch();
  const { status } = useAppSelector(({ roles }) => roles);
  const [state, setState] = React.useState<RoleListState>({
    actionInProgress: false,
    activeEntityId: 0,
    appDefId: 0,
    bulkAction: {
      selectedRow: []
    },
    callBackAction: undefined,
    callChildCallback: false,
    dropdownEle: {},
    editMember: false,
    filterConfig: {
      searchKey: '',
      search: false,
      field: 'name'
    },
    isDeletedChecked: false,
    isRowHidden: false,
    hideRow: {},
    nestedChildData: []
  });

  const {
    actionInProgress,
    bulkAction,
    dropdownEle,
    filterConfig,
    hideRow,
    isDeletedChecked,
    isRowHidden
  } = state;

  const sortQuery: string = '[{"id":{"order":"desc"}}]';

  const handleCheckboxChange = (isChecked: boolean) => {
    setState(prevState => ({
      ...prevState,
      isDeletedChecked: !prevState.isDeletedChecked
    }));

    if (isChecked) {
      dispatch(getRoles(queries.getPublishedAndDeleted));
    } else {
      dispatch(getRoles(queries.getPublished));
    }
  };

  const handleRowHide = () => {
    if (bulkAction.selectedRow.length > 1) {
      alert('You can hide only one row')
      return;
    }

    setState(prevState => ({
      ...prevState,
      hideRow: {
        id: +bulkAction.selectedRow[0]
      },
      bulkAction: {
        selectedRow: []
      }
    }));
  };

  // function needs to be called on onChange for checkBox
  const bulkOptions = () => {
    return [
      {
        content: (
          <Checkbox
            checked={isDeletedChecked}
            label={'Show Deleted'}
            onChange={handleCheckboxChange}
          />
        )
      }
    ];
  };

  // function needs to be called on onChange for checkBox
  const bulkActions = () => {
    return [
      {
        content: (
          <Checkbox
            checked={isRowHidden}
            label={'Hide'}
            onChange={handleRowHide}
          />
        )
      }
    ];
  };

  // Callback function when any row gets selected
  const handleSelectRowCallback = (val: React.ReactText[]) => {
    setState(prevState => ({
      ...prevState,
      bulkAction: {
        selectedRow: val
      }
    }));
  };

  // Toggle dropdowns present in this component
  const toggleDropdown = (
    event: React.FormEvent<HTMLElement>,
    currentDropdown: string
  ) => {
    setState(prev => ({
      ...prev,
      dropdownEle: { [currentDropdown]: event.currentTarget as HTMLElement }
    }));
  };

  const searchFieldStyle = classNames(
    theme.commonLeftMargin,
    theme.searchField
  );

  const handleInputChange = async (value: string) => {
    setState(prevState => ({
      ...prevState,
      filterConfig: { ...prevState.filterConfig, searchKey: value }
    }));

    dispatch(getRoles(queries.getBySearch(value)));
  };

  const debouncedChangeHandler = React.useCallback(
    debounce(handleInputChange, 700),
    []
  );

  return (
    <FlexBox>
      <Column medium="4-4">
        <div className={theme.pageContainer}>
          <Heading element="h2" theme={CommonStyle}>
            Roles
          </Heading>

          <FlexBox
            direction="Row"
            align="Start"
            justify="Start"
            componentClass={theme.tableActions}
          >
            <div>
              <Button
                componentSize="large"
                disclosure={true}
                onClick={(event: React.FormEvent<HTMLElement>) =>
                  toggleDropdown(event, 'bulkAction')
                }
                disabled={!bulkAction.selectedRow.length}
              >
                Bulk Actions{' '}
                {bulkAction.selectedRow.length
                  ? `(${bulkAction.selectedRow.length})`
                  : ''}
              </Button>

              <Dropdown
                dropdownItems={bulkActions()}
                anchorEl={dropdownEle.bulkAction}
                preferredAlignment="left"
              />
            </div>

            <div className={searchFieldStyle}>
              <TextField
                label="Find a Role..."
                value={filterConfig.searchKey}
                onChange={debouncedChangeHandler}
              />
            </div>

            <div className={theme.commonLeftMargin}>
              <Button
                disabled={actionInProgress}
                componentSize="large"
                icon="horizontalDots"
                onClick={(event: React.FormEvent<HTMLElement>) =>
                  toggleDropdown(event, 'filter')
                }
              />

              <Dropdown
                dropdownItems={bulkOptions()}
                anchorEl={dropdownEle.filter}
                preferredAlignment="right"
              />
            </div>
          </FlexBox>

          {status === 'pending' && (
            <div className={theme.spinnerContainer}>
              <DrawerSpinner
                componentClass={theme.espinner}
                spinnerText="Loading Roles..."
              />
            </div>
          )}

          {roleDefs ? (
            <Table
              actionInProgress={actionInProgress}
              columnFirstChildWidth="25px"
              hideRow={hideRow}
              bordered={true}
              highlight={true}
              sorting="all"
              data={roleDefs}
              column={nestedColumnConfig}
              filterData={filterConfig}
              rowAction={[]}
              rowCallbackValue="id"
              selectRow="checkbox"
              selectRowCallback={handleSelectRowCallback}
              theme={TableStyle}
            />
          ) : null}

          <div className={theme.testing}>
            CLASS PREFIX TEST (Hover using DevTools)
          </div>
        </div>
      </Column>
    </FlexBox>
  );
};

export default themr(
  ROLE,
  baseTheme
)(RoleListComponent) as ThemedComponentClass<RoleListProp, RoleListState>;
