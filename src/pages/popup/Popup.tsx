import React, { useState } from "react";
import logo from "@assets/img/logo.svg";
import "@pages/popup/Popup.css";
import useStorage from "@src/shared/hooks/useStorage";
import withSuspense from "@src/shared/hoc/withSuspense";
import {
  AppLayout,
  ContentLayout,
  Header,
  Button,
  Container,
  TextContent,
  Select,
  Textarea,
  SpaceBetween,
  Modal,
  Input,
} from "@cloudscape-design/components";
import settingsStorage from "@root/src/shared/storages/settingsStorage";
import * as api from "../../api";
const QUIP_DOMAIN = "quip-amazon.com";

const Settings = (props: any) => {
  const [selectedOption, setSelectedOption] = useState(props.settings.language);
  const [quipId, setQuipId] = useState(props.settings.quipId);
  const [quipAuthToken, setQuipAuthToken] = useState(props.settings.quipToken);
  return (
    <Modal
      header="Settings"
      visible={props.visible}
      onDismiss={() => props.onDismiss()}
    >
      <SpaceBetween size="s">
        <p>Select the language you are writing</p>
        <Select
          onChange={({ detail }: any) =>
            setSelectedOption(detail.selectedOption)
          }
          options={[
            { label: "English", value: "en" },
            { label: "中文", value: "zh" },
            { label: "Español", value: "es" },
          ]}
          selectedOption={selectedOption}
        />
        <p>Quip Document Id where to enter the narrative</p>
        <Input
          type="text"
          value={quipId}
          onChange={({ detail }) => setQuipId(detail.value)}
        />
        <p>Quip Auth Token</p>
        <Input
          type="text"
          value={quipAuthToken}
          onChange={({ detail }) => setQuipAuthToken(detail.value)}
        />
        <Button
          variant="primary"
          onClick={() => {
            settingsStorage.setStorage({
              language: selectedOption,
              quipId: quipId,
              quipToken: quipAuthToken,
            });
            props.onDismiss();
          }}
        >
          Save
        </Button>
      </SpaceBetween>
    </Modal>
  );
};

const Content = () => {
  const settings = useStorage(settingsStorage);
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState("");
  const [value, setValue] = useState("");
  const handleSubmit = async () => {
    setLoading(true);
    const res = await api.createNarrative(settings.language.value, value);
    setLoading(false);
    setResponse(res);
  };
  const saveToQuip = async () => {
    await fetch(
      `https://platform.${QUIP_DOMAIN}/1/threads/edit-document?thread_id=${settings.quipId}&format=html&content=${response}&location=0`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${settings.quipToken}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
    alert("Saved to Quip");
  };
  return (
    <ContentLayout
      header={
        <Header
          actions={
            <Button
              iconName="settings"
              variant="icon"
              onClick={() => setVisible(true)}
            />
          }
          variant="h1"
        >
          Balder
        </Header>
      }
    >
      <Container>
        <Settings
          settings={settings}
          visible={visible}
          onDismiss={() => setVisible(false)}
        />
        <SpaceBetween size="s">
          <p>Write the narrative</p>
          <Textarea
            onChange={({ detail }) => setValue(detail.value)}
            value={value}
            placeholder="Add your narrative here..."
            rows={15}
          />
          <Button
            disabled={loading}
            loading={loading}
            variant="primary"
            onClick={() => handleSubmit()}
          >
            Submit
          </Button>
          <div dangerouslySetInnerHTML={{ __html: response }}></div>
          {response !== "" && (
            <Button onClick={() => saveToQuip()}>Save to Quip</Button>
          )}
        </SpaceBetween>
      </Container>
    </ContentLayout>
  );
};

const Popup = () => {
  return <AppLayout navigationHide content={<Content />} toolsHide />;
};

export default withSuspense(Popup);
