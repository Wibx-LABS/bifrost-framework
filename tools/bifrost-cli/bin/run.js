#!/usr/bin/env node

'use strict';

const { run, flush, Errors } = require('@oclif/core');

run(process.argv.slice(2), __dirname + '/..')
    .then(flush)
    .catch(Errors.handle);
