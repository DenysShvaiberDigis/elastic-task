import * as React from 'react';
import { Checkbox, FlexBox, Column, Heading, Table } from 'engage-ui';
import { themr, ThemedComponentClass } from '@friendsofreactjs/react-css-themr';

import queries from 'constants/queries';
import debounce from 'helpers/debounce';
import { RoleListState } from './RoleListState';
import { RoleListProp } from './RoleListProp';
import useAppDispatch from 'store/hooks/useAppDispatch';
import { getRoles } from 'store/rolesSlice/rolesSlice';
import useAppSelector from 'store/hooks/useAppSelector';
import TableControl from './TableControl';
import { ROLE } from '../../../ThemeIdentifiers';
import DrawerSpinner from '../../../Common/Components/DrawerSpinner';
import nestedColumnConfig from './TableColumns';

const baseTheme = require('../Styles/RoleList.scss');
const TableStyle = require('../../../Theme/Table.scss');
const CommonStyle = require('../../../Theme/ListTheme.scss');

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
    hideRow: {},
    nestedChildData: []
  });

  const {
    actionInProgress,
    bulkAction,
    dropdownEle,
    filterConfig,
    hideRow,
    isDeletedChecked
  } = state;

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
    return [];
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

          <TableControl
            theme={theme}
            actionInProgress={actionInProgress}
            bulkAction={bulkAction}
            bulkActions={bulkActions}
            bulkOptions={bulkOptions}
            dropdownEle={dropdownEle}
            debouncedChangeHandler={debouncedChangeHandler}
            filterConfig={filterConfig}
            toggleDropdown={toggleDropdown}
          />

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
