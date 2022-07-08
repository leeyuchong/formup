import {
  Group,
  Text,
  useMantineTheme,
  MantineTheme,
  Button,
} from "@mantine/core";
import {
  Upload,
  FileSpreadsheet,
  X,
  Icon as TablerIcon,
} from "tabler-icons-react";
import { Dropzone, DropzoneStatus, MIME_TYPES } from "@mantine/dropzone";
import { useRouter } from "next/router";
import axios from "axios";
import { useState } from "react";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) : string {
  return status.accepted
    ? theme.colors[theme.primaryColor][theme.colorScheme === "dark" ? 4 : 6]
    : status.rejected
    ? theme.colors.red[theme.colorScheme === "dark" ? 4 : 6]
    : theme.colorScheme === "dark"
    ? theme.colors.dark[0]
    : theme.colors.gray[7];
}

function ImageUploadIcon({
  status,
  ...props
}: React.ComponentProps<TablerIcon> & { status: DropzoneStatus }) {
  if (status.accepted) {
    return <Upload {...props} />;
  }

  if (status.rejected) {
    return <X {...props} />;
  }

  return <FileSpreadsheet {...props} />;
}

export const dropzoneChildren = (
  status: DropzoneStatus,
  theme: MantineTheme
): JSX.Element => (
  <Group
    position="center"
    spacing="xl"
    style={{ minHeight: 220, pointerEvents: "none" }}
  >
    <ImageUploadIcon
      status={status}
      style={{ color: getIconColor(status, theme) }}
      size={80}
    />

    <div>
      <Text size="xl" inline>
        Drag images here or click to select files
      </Text>
      <Text size="sm" color="dimmed" inline mt={7}>
        Attach as many files as you like, each file should not exceed 5mb
      </Text>
    </div>
  </Group>
);

const clientUploadFile = async (file: File, onUploadProgress) => {
  let formData = new FormData();
  formData.append("file", file);
  return axios.post("/api/file-upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
    onUploadProgress,
  });
};


// reference: https://www.bezkoder.com/react-drag-drop-file-upload/

// On upload:
// make the api call to upload the data
// do the processing server side, return stuff
// put the stuff in the router as query parameters and then route the user to
// next page, use SSR to render the page.
function FairAccIndex(props) {
  const theme = useMantineTheme();
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState({
    progress: 0,
    currentFile: null,
  });
  const upload = async () => {
    try {
      const response = await clientUploadFile(uploadedFile.currentFile, (event) => {
        setUploadedFile({
          ...uploadedFile,
          progress: Math.round((100 * event.loaded) / event.total),
        });
      });
      console.log(response);
      router.push("/fairacc/questions")
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <Dropzone
        onDrop={(files) => {
          if (files.length > 0) {
            setUploadedFile({ ...uploadedFile, currentFile: files[0] });
          }
        }}
        onReject={(files) => console.log("rejected files", files)}
        maxSize={3 * 1024 ** 2}
        accept={[MIME_TYPES.csv]}
        multiple={false}
      >
        {(status) => dropzoneChildren(status, theme)}
      </Dropzone>
      <span>{uploadedFile.progress}%</span>
      <Button onClick={upload}>Button</Button>
    </div>
  );
}

export default FairAccIndex;
