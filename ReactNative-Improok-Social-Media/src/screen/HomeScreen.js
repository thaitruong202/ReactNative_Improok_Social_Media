import React, { useState, Fragment } from "react";
import { Button, Image, ScrollView, StyleSheet, View } from "react-native";
import SubHeader from "../layouts/SubHeader";

const HomeScreen = () => {

    return (
        <Fragment>
            <ScrollView>
                <SubHeader />
            </ScrollView>
        </Fragment>
    )
}

const styles = StyleSheet.create({
    homeContainer: {
        backgroundColor: "#c9ccd1",
    },
});

export default HomeScreen;