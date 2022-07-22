import { Quest } from '../../models/models';
import * as Auth from '../../helpers/auth';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        quests: () => Quest.find({})
    }
};