// misc
import api from './api';
import drop from './drop';

// user
import user from './user/user';
import social from './user/social';

// gamification
import quest from './gamification/quest';

// spaces
import space from './spaces/space';
import proposal from './spaces/proposal';

// collab
import project from './collab-tool/project';
import collab from './collab-tool/collab';

// staff management
import wallet from './staff-tool/wallet';
import claimer from './staff-tool/claimer';

export default [user, social, quest, api, drop, project, collab, space, proposal, wallet, claimer];