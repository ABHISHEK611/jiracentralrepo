import ForgeUI, { render, Fragment, Text, AdminPage, useState, useEffect, Image } from '@forge/ui';
import { fetch } from '@forge/api';

const App2 = () =>
{

    const [avatarUrl, setAvatarUrl] = useState(undefined);

    useEffect(() => {
        fetch("https://api.github.com/users/ABHISHEK611")
        .then((res) => res.json())
        .then(
            (result) => {
                console.log(result);
                setAvatarUrl(result.avatar_url);
            },
            (error) => {
                console.log(error);
            }
            );
    },[]);

    return (
        <Fragment>
          <Text>Welcome to GitHub Integration</Text>
          <Image
            src={avatarUrl}
            alt="ImageOfGitHubAccount"
          />
        </Fragment>
      );
};

export const run2 = render(
  <AdminPage>
    <App2 />
  </AdminPage>
);
