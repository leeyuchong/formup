import {
  Box,
  Button,
  Center,
  Group,
  Paper,
  Radio,
  RadioGroup,
  Text,
} from "@mantine/core";
import { FormList, formList, useForm } from "@mantine/form";
import axios from "axios";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { GripVertical, X } from "tabler-icons-react";

function FairAccQuestions(props) {
  const router = useRouter();
  // const [s, setS] = useState({});
  const [colNames, setColNames] = useState([]);
  const [fileName, setFileName] = useState("");
  const [preferenceColIdx, setPrefColIdx] = useState<string[]>([]);
  const form = useForm({
    initialValues: {
      nameCol: "", // name of the column with name of people
      respOrderCol: "", // name of column with order information
      prefOrderCol: formList<string>([]), // object of column name and order
      // vacancies: {} // object of offering and vacancies
    },
  });
  const [step, setStep] = useState(1);
  const nextStep = () => {
    setStep((currStep) => currStep + 1);
  };
  const prevStep = () => {
    setStep((currStep) => (currStep > 1 ? currStep - 1 : currStep));
  };
  useEffect(() => {
    if (router.isReady) {
      setColNames(JSON.parse(router.query.colNames as string));
      setFileName(router.query.fileName as string);
    }
  }, [router.isReady]);

  useEffect(() => {
    form.setFieldValue("prefOrderCol", colNames as FormList<string>);
  }, [colNames]);
  const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  function onDragEnd(result) {
    if (!result.destination) {
      return;
    }

    if (result.destination.index === result.source.index) {
      return;
    }

    const cols = reorder(
      colNames,
      result.source.index,
      result.destination.index
    );

    setColNames(cols);
  }

  // const wrapper = () => {}

  switch (step) {
    case 1:
      return (
        <Box>
          <Text>Which option represents the respondent's name?</Text>
          <RadioGroup
            onChange={(value) => {
              form.setFieldValue("nameCol", colNames[value]);
            }}
          >
            {colNames.map((item, idx) => (
              <Radio key={`1${idx}`} value={`${idx}`} label={item} />
            ))}
          </RadioGroup>
          <Button onClick={nextStep}>Next step</Button>
        </Box>
      );
    case 2:
      return (
        <Box>
          <Text>Which option represents the choosing order?</Text>
          <RadioGroup
            onChange={(value) => {
              form.setFieldValue("respOrderCol", colNames[value]);
            }}
          >
            {colNames.map((item, idx) => (
              <Radio key={`2${idx}`} value={`${idx}`} label={item} />
            ))}
            <Radio
              value={""}
              label="No picking order, shuffle the respondents"
            />
          </RadioGroup>
          <Button onClick={nextStep}>Next step</Button>
        </Box>
      );
    case 3:
      const fields = colNames.map((col, idx) => (
        <Draggable key={`4${idx}`} index={idx} draggableId={idx.toString()}>
          {(provided) => (
            <Group ref={provided.innerRef} mt="xs" {...provided.draggableProps}>
              <Center {...provided.dragHandleProps}>
                <GripVertical size={18} />
              </Center>
              <Paper>{col}</Paper>
              <Button
                onClick={() => {
                  setColNames((prev) => prev.filter((_, i) => i !== idx));
                }}
              >
                <X size={18} />
              </Button>
            </Group>
          )}
        </Draggable>
      ));
      return (
        <div>
          <DragDropContext
            onDragEnd={
              onDragEnd
              // {console.log(form.values.prefOrderCol)
              // form.reorderListItem("prefOrderCol", {
              //   from: source.index,
              //   to: destination.index,
              // })}
            }
          >
            <Droppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef}>
                  {fields}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          <Group position="left" mt="md">
            <Button
              type="submit"
              onClick={form.onSubmit((values) => console.log(values))}
            >
              Submit
            </Button>
          </Group>
        </div>
      );
  }
}

export default FairAccQuestions;
