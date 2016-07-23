'use strict';

/**
 * Module dependencies
 */
import * as fs from 'fs';
import * as mongo from 'mongodb';
import File from '../../../models/drive-file';
import User from '../../../models/user';
import serialize from '../../../serializers/drive-file';
import create from '../../../common/add-file-to-drive';

/**
 * Create a file
 *
 * @param {Object} params
 * @param {Object} reply
 * @param {Object} app
 * @param {Object} user
 * @return {void}
 */
module.exports = async (params, file, reply, app, user) =>
{
	// Init 'name' parameter
	let name = params.name;
	if (name !== undefined && name !== null) {
		name = name.trim();
		if (name.length === 0) {
			name = null;
		} else if (name.length > maxTextLength) {
			return reply(400, 'too long name');
		} else if (name.indexOf('\\') !== -1 || name.indexOf('/') !== -1 || name.indexOf('..') !== -1) {
			return reply(400, 'invalid name');
		}
	} else {
		name = null;
	}

	const buffer = fs.readFileSync(file.path);
	fs.unlink(file.path);

	const driveFile = await create(user._id, buffer, name);

	reply(await serialize(driveFile));
};
