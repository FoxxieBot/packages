import { useState } from 'react';
import FoxxieDiscordServerPanel from './FoxxieDiscordServerPanel';
import FoxxieDiscordChannelPanel from './FoxxieDiscordChannelPanel';
import FoxxieDiscordChatSection from './FoxxieDiscordChatSection';

export default function FoxxieDiscordUI() {
    const [section, setSection] = useState('moderation-log');

    return (
        <div className='hidden h-screen w-screen sm:flex'>
            {/** server section */}
            <FoxxieDiscordServerPanel />
            {/** channel section */}
            <FoxxieDiscordChannelPanel setSection={setSection} section={section} />
            {/** chat section */}
            <FoxxieDiscordChatSection section={section} />
        </div>
    );
}
