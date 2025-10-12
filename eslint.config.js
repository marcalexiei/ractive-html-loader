import { defineConfig, globalIgnores } from 'eslint/config';
import base from '@marcalexiei/eslint-config/base';

export default defineConfig(globalIgnores(['dist', 'docs']), base);
