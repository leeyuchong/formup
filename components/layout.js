import {
  AppShell,
  Navbar,
  Header,
  Footer,
  Text,
  MediaQuery,
  Burger,
  useMantineTheme,
  createStyles,
  Anchor,
} from "@mantine/core";
import React, { useState } from "react";

const useStyles = createStyles((theme) => ({
  navbar: {
    [theme.fn.largerThan("sm")]: {
      display: "none",
    },
  },
  links: {
    [theme.fn.smallerThan("sm")]: {
      display: "none",
    },
  },
}));
export default function Layout({ children }) {
  const theme = useMantineTheme();
  const { classes } = useStyles();
  const [opened, setOpened] = useState(false);
  return (
    <AppShell
      styles={{
        main: {
          background:
            theme.colorScheme === "dark"
              ? theme.colors.dark[8]
              : theme.colors.gray[0],
        },
      }}
      navbarOffsetBreakpoint="sm"
      fixed
      navbar={
        <Navbar
          className={classes.navbar}
          width={{ base: "100%", sm: 0 }}
          hidden={!opened}
        >
          <Anchor>Home</Anchor>
          <Anchor>Features</Anchor>
          <Anchor>Pricing</Anchor>
        </Navbar>
      }
      footer={
        <Footer height={60} p="md">
          <Text>Application footer</Text>
        </Footer>
      }
      header={
        <Header height={70} p="md">
          <div
            style={{ display: "flex", alignItems: "center", height: "100%" }}
          >
            <MediaQuery largerThan="sm" styles={{ display: "none" }}>
              <Burger
                opened={opened}
                onClick={() => setOpened((o) => !o)}
                size="sm"
                color={theme.colors.gray[6]}
                mr="xl"
              />
            </MediaQuery>
            <div className={classes.links}>
              <Anchor>Home</Anchor>
              <Anchor>Features</Anchor>
              <Anchor>Pricing</Anchor>
            </div>
          </div>
        </Header>
      }
    >
      <main>{children}</main>
    </AppShell>
  );
}
