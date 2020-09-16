import { RegisterDidCard } from './register-did-card';
import { withDID } from './with-did-hoc';
const SELFKEY_ID_PATH = '/main/selfkeyId';

export const RegisterDidCardContainer = withDID(RegisterDidCard, { returnPath: SELFKEY_ID_PATH });

export default RegisterDidCardContainer;
