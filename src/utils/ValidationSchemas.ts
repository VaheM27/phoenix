import {t} from 'i18next';
import * as yup from 'yup';
import {passwordRegex} from './Regex';

export const emailSchema = yup
  .string()
  .email(t('invalid_email'))
  .required(t('required'))
  .label('Email');
const passwordSchema = yup
  .string()
  .required(t('required'))
  .matches(passwordRegex, t('password_validation'));

export const signInSchema = yup.object().shape({
  username: emailSchema,
  password: passwordSchema,
});

export const signUpSchema = yup.object().shape({
  name: yup.string().required(t('required')),
  email: emailSchema,
  password: passwordSchema,
});

export const forgotPasswordSchema = yup.object().shape({
  username: emailSchema,
});

export const offerSchemas = {
  offerSchema1: yup.object().shape({
    postTitle: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_1.post_title_required'))
      .min(5, t('OFFER_SCHEMAS.OFFER_SCHEMA_1.post_title_min'))
      .max(24, t('OFFER_SCHEMAS.OFFER_SCHEMA_1.post_title_max')),
    brand: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_1.brand_required')),
    phoneColor: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_1.phone_color_required')),
    phoneModel: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_1.phone_model_required')),
    phoneStorage: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_1.phone_storage_required')),
  }),
  offerSchema2: yup.object().shape({
    phoneCondition: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_2.phone_condition_required')),
  }),
  offerSchema3: yup.object().shape({
    description: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_3.description_required'))
      .max(150, t('OFFER_SCHEMAS.OFFER_SCHEMA_3.description_max')),
    contactNumber: yup
      .string()
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_3.contact_number_required'))
      .matches(
        /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
        t('OFFER_SCHEMAS.OFFER_SCHEMA_3.contact_number_valid'),
      ),
    askingPrice: yup
      .string()
      .matches(
        /^[0-9٠-٩]*$/,
        t('OFFER_SCHEMAS.OFFER_SCHEMA_3.asking_price_valid'),
      )
      .required(t('OFFER_SCHEMAS.OFFER_SCHEMA_3.asking_price_required')),
  }),
};
