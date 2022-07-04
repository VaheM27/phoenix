import {action, makeObservable, observable, computed} from 'mobx';
import _ from 'lodash';
import {Api} from '~/utils';
import {Endpoints} from '~/config';
import {getCurrentPosition} from '~/helpers';
import {Offer} from '~/types';
import {GeoCoordinates} from 'react-native-geolocation-service';

export class OffersStore {
  loading: boolean = false;
  refreshing: boolean = false;
  list: Offer[] = [];
  hasNextPage = true;
  skip = 0;
  error?: any = null;
  lastFetchCoords: GeoCoordinates | null = null;

  constructor() {
    makeObservable(this, {
      loading: observable,
      refreshing: observable,
      list: observable,
      enteris: computed,
      getData: action,
      error: observable,
      setList: action,
      setRefreshing: action,
      setError: action,
      setLoading: action,
    });
  }
  setLoading = (value: boolean) => (this.loading = value);
  setRefreshing = (value: boolean) => (this.refreshing = value);
  setError = (value: any) => (this.error = value);
  setList = (value: Offer[]) => (this.list = value);

  get enteris(): {[id: string]: Offer} {
    return _.keyBy(this.list, 'id');
  }

  clearStore = () => {
    this.list = [];
    this.loading = false;
    this.refreshing = false;
    this.error = null;
    this.hasNextPage = true;
    this.skip = 0;
  };

  getData = async (refresh?: boolean) => {
    if (this.loading) {
      return;
    }
    try {
      this.setLoading(true);
      const isNextPage = this.hasNextPage && !refresh;
      let coords = isNextPage ? this.lastFetchCoords : null;
      if (!coords) {
        const position = await getCurrentPosition();
        coords = position.coords;
      }
      const {latitude, longitude} = coords;
      const {data: response} = await Api().get(
        `${Endpoints.OFFERS}?latitude=${latitude}&longitude=${longitude}`,
      );
      const {data, limit} = response;

      this.hasNextPage = data.length === limit;
      this.skip += limit;
      this.setList(isNextPage ? _.uniqBy(this.list.concat(data), 'id') : data);
    } catch (error) {
      this.setError(error);
    } finally {
      this.setLoading(false);
    }
  };

  fetchMore = async () => {
    if (!this.hasNextPage) {
      return;
    }
    this.getData();
  };

  refresh = async () => {
    this.setRefreshing(true);
    await this.getData(true);
    this.setRefreshing(false);
  };
}

export const offersStore = new OffersStore();
