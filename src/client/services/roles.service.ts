import { endpoints } from 'constants/urls';
import { IRoleDef } from 'Types/Domain';
import { AxiosRes, axiosService } from './axios.service';

interface ITotal {
  value: number;
  relation: string;
}

export interface IHit<T> {
  _id: string;
  _index: string;
  _score: number;
  _source: T[];
  _type: string;
}

interface IHits<T> {
  hits: IHit<T>[];
  maxScore: number;
  total: ITotal;
}

interface IShard {
  failed: number;
  skipped: number;
  successful: number;
  total: number;
}

export interface IRolesResponse<T> {
  hits: IHits<T>;
  timed_out: boolean;
  took: number;
  _shards: IShard;
}

export const rolesService = {
  get: (query: any): AxiosRes<IRolesResponse<IRoleDef[]>> =>
    axiosService.post(endpoints.searchRoles, query).then(res => res)
};
