import tseslint from 'typescript-eslint';
export default tseslint.config(
 {ignores:['dist/**','node_modules/**','work/**','docs/**','test-results/**']},
 ...tseslint.configs.recommended,
 {files:['**/*.ts','**/*.tsx'],rules:{'@typescript-eslint/no-explicit-any':'off','@typescript-eslint/no-unused-vars':['error',{argsIgnorePattern:'^_',varsIgnorePattern:'^_'}],'no-empty':['error',{allowEmptyCatch:true}],'@typescript-eslint/no-unused-expressions':['error',{allowTernary:true,allowShortCircuit:true}]}},
);
