import ForgeUI, {
  render,
  useState,
  useProductContext,
  Button,
  Text,
  InlineDialog,
  ContentBylineItem,
} from "@forge/ui";
import { properties } from "@forge/api";

const App = () => {
  const { contentId } = useProductContext();
  const [isApproved, setIsApproved] = useState(async () => {
    const status =
      (await properties.onConfluencePage(contentId).get("isApproved")) || false;
    return status;
  });

  const approve = async () => {
    await properties
      .onConfluencePage(contentId)
      .set("isApproved", true)
      .then(() => setIsApproved(true));
  };
  const unapprove = async () => {
    await properties
      .onConfluencePage(contentId)
      .set("isApproved", false)
      .then(() => setIsApproved(false));
  };

  const pageStatus = isApproved ? "👍 Approved" : "👎 Rejected";

  return (
    <InlineDialog>
      <Text>{`Current Approved Status is: ${pageStatus}`}</Text>
      <Button text="approve" onClick={approve}></Button>
      <Button text="unapprove" onClick={unapprove}></Button>
    </InlineDialog>
  );
};

export const run = render(
  <ContentBylineItem>
    <App />
  </ContentBylineItem>
);

export const getDP = async (contextPayload) => {
  // for demo purposes; please toggle
  const useValidIcon = false;
  const date = new Date().toTimeString();

  const {
    extension: {
      content: { id: contentId },
    },
  } = contextPayload;

  const isApproved =
    (await properties.onConfluencePage(contentId).get("isApproved")) || false;
  const pageStatus = isApproved ? "👍 Approved" : "👎 Rejected";

  return {
    title: `Current Page Status is: ${pageStatus}`,
    icon: useValidIcon
      ? "http://jira.atlassian.com/images/icons/priorities/high.svg"
      : "invalid-icon-path",
    tooltip: `This is an example tooltip that was last updated on ${date}`,
  };
};
