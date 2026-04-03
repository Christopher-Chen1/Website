import { BasicQueryStringUtils, LocationLike } from '@openid/appauth';

export class NoHashQueryStringUtils extends BasicQueryStringUtils {
  parse(input: LocationLike) {
    // second arg for use hash should be false
    return super.parse(input, false);
  }
}
