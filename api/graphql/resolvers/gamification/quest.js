import { Quest } from '../../../models/models';

export default {
    Query: {
        // TODO: projection, pagination, sanitization
        quests: () => Quest.find({})
    }
};