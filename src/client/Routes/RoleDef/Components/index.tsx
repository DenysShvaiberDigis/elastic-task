import * as React from 'react';
import queries from 'constants/queries';
import useAppDispatch from 'store/hooks/useAppDispatch';
import useAppSelector from 'store/hooks/useAppSelector';
import { getRoles } from 'store/rolesSlice/rolesSlice';

import RoleListComponent from './RoleList';
import { ThemeContext } from '../../../Context';

/**
 * Root component which calls the list component to show the existing role list
 * Then list component calls different other components like create, members, etc
 */
const RoleDefComponent = () => {
  const dispatch = useAppDispatch();
  const { roles } = useAppSelector(({ roles }) => roles);

  React.useEffect(() => {
    dispatch(getRoles(queries.getPublished));
  }, []);

  console.log(roles);
  
  return (
    <div>
      <ThemeContext.Consumer>
        {theme => <RoleListComponent theme={theme} roleDefs={roles} />}
      </ThemeContext.Consumer>
    </div>
  );
};

export default RoleDefComponent;
