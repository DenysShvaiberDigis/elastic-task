import * as React from 'react';
import { Button, FlexBox, TextField, Dropdown } from 'engage-ui';
import { classNames } from '@shopify/react-utilities/styles';

import {
  BulkActionType,
  DropdownType,
  FilterType,
  RoleListState
} from './RoleListState';

interface IProps {
  theme: any;
  toggleDropdown: (event: React.FormEvent<HTMLElement>, currentDropdown: string) => void;
  bulkAction: BulkActionType;
  bulkActions: () => any[];
  dropdownEle: DropdownType;
  debouncedChangeHandler: () => void;
  filterConfig: FilterType;
  actionInProgress: boolean;
  bulkOptions: () => {
    content: JSX.Element;
  }[];
}

const TableControl: React.FC<IProps> = React.memo(
  ({
    theme,
    toggleDropdown,
    bulkAction,
    bulkActions,
    dropdownEle,
    debouncedChangeHandler,
    filterConfig,
    actionInProgress,
    bulkOptions
  }) => {
    const searchFieldStyle = classNames(
      theme.commonLeftMargin,
      theme.searchField
    );

    return (
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
    );
  }
);

export default TableControl;
