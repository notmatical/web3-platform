// misc
import root from './root';
import api from './api';
import drop from './drop';

// user
import user from './user/user';
import social from './user/social';

// gamification
import quest from './gamification/quest';

// spaces
import space from './space';
import proposal from './proposal';

// collab
import project from './collab-tool/project';
import collab from './collab-tool/collab';

// staff management
import wallet from './staff-tool/wallet';
import claimer from './staff-tool/claimer';

// job listing
import company from './job-listing/company';
import job from './job-listing/job';

export default [user, social, quest, collab, project, space, proposal, api, drop, wallet, claimer, company, job, root];