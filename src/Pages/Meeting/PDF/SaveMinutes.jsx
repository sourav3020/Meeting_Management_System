import {
  Document,
  Font,
  Page,
  pdf,
  StyleSheet,
  Text,
  View,
} from "@react-pdf/renderer";
import { useEffect, useState } from "react";

//import thin from "../../../assets/fonts/TiroBangla-Regular.ttf";
import meraj from "../../../assets/fonts/Kalpurush.ttf";
import { departmentSuffixMap } from "../departmentMappings";

// Register font
//Font.register({ family: "TiroBangla", fonts: [{ src: thin }] });
Font.register({ family: "Kalpurush", fonts: [{ src: meraj }] });

const base_url = import.meta.env.VITE_API_URL;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontFamily: "Kalpurush",
    padding: "10px",
  },
  section: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    paddingRight: "30px",
    paddingLeft: "50px",
    gap: "78px",
    lineHeight: "1.5",
  },
  text: {
    lineHeight: "1.5",
  },
});

const SaveMinutes = ({ meetingID, onComplete }) => {
  const [meetingInfo, setMeetingInfo] = useState([]);
  const [agendaInfo, setAgendaInfo] = useState([]);
  const [attendeeInfo, setAttendeeInfo] = useState([]);
  const [chairmanInfo, setChairmanInfo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const meetingResponse = await fetch(
          `${base_url}/api/meeting/meetingInfo/${meetingID}`
        );
        if (meetingResponse.ok) {
          const meetingData = await meetingResponse.json();
          setMeetingInfo(meetingData[0]);
        }

        const agendaResponse = await fetch(
          `${base_url}/api/meeting/agenda/${meetingID}`
        );
        if (agendaResponse.ok) {
          const agendaData = await agendaResponse.json();
          setAgendaInfo(agendaData);
        }

        const attendeeResponse = await fetch(
          `${base_url}/api/meeting/attendees/${meetingID}`
        );
        if (attendeeResponse.ok) {
          const attendeeData = await attendeeResponse.json();
          setAttendeeInfo(attendeeData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [meetingID]);

  // Separate useEffect to fetch chairman info based on meetingInfo
  useEffect(() => {
    async function fetchChairmanInfo() {
      try {
        const token = localStorage.getItem("authToken");
        const headers = {
          "Content-Type": "application/json",
        };

        // Add the token to the Authorization header if available
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const chairmanId = meetingInfo.signature_url;
        const response = await fetch(`${base_url}/api/user/${chairmanId}`, {
          method: "GET",
          headers,
        });

        if (response.ok) {
          const data = await response.json();
          setChairmanInfo(data.data);
          console.log("Chairman Email:", data.data);
        } else {
          console.error("Failed to fetch chairman info:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching chairman info:", error);
      }
    }
    console.log(meetingInfo.signature_url);

    if (meetingInfo.signature_url) {
      fetchChairmanInfo();
    }
  }, [meetingInfo.signature_url]);

  // Function to format meeting date, day, and time in Bangla
  const formatMeetingDateTime = (meetingTime) => {
    const date = new Date(meetingTime);

    // Function to format date as dd/mm/yyyy
    const formatDate = () => {
      const options = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        timeZone: "Asia/Dhaka",
      };
      return date.toLocaleDateString("bn-BD", options).replace(/\//g, "/");
    };

    // Function to format time as HH:MM:SS
    const formatTime = () => {
      const options = {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
        timeZone: "Asia/Dhaka",
      };
      const timeString = date.toLocaleTimeString("bn-BD", options);
      return timeString.replace(/ (AM|PM)/, ""); // Removes AM/PM
    };

    // Function to get day of the week
    const formatDayOfWeek = () => {
      return date.toLocaleDateString("bn-BD", { weekday: "long" });
    };

    return {
      date: formatDate,
      time: formatTime,
      day: formatDayOfWeek,
    };
  };

  const convertToBengaliNumber = (number) => {
    const bengaliNumbers = {
      0: "০",
      1: "১",
      2: "২",
      3: "৩",
      4: "৪",
      5: "৫",
      6: "৬",
      7: "৭",
      8: "৮",
      9: "৯",
    };
    return number
      ? number.toString().replace(/\d/g, (char) => bengaliNumbers[char])
      : "";
  };

  const formatAttendeeName = (attendee) => {
    const { title_bn, first_name_bn, last_name_bn, designation_bn } = attendee;

    let name = "";
    if (designation_bn === "অধ্যাপক") {
      name += designation_bn + " ";
    }
    if (title_bn) {
      name += title_bn + " ";
    }
    // Append first and last names
    name += first_name_bn + " " + last_name_bn;
    if (designation_bn && designation_bn !== "অধ্যাপক") {
      name += ", " + designation_bn;
    }
    return name;
  };

 
  const formatFullAttendeeName = (attendee) => {
    let formattedName = formatAttendeeName(attendee);
    const departmentSuffix = departmentSuffixMap[meetingInfo.department_name_bn];
     if (departmentSuffix)
       {
         formattedName += departmentSuffix;
      }
    return formattedName;
  };
  
  const chairmanDisplayName = chairmanInfo
    ? `${
        chairmanInfo.designation_bn
          ? chairmanInfo.designation_bn === "অধ্যাপক"
            ? chairmanInfo.designation_bn + " "
            : ""
          : ""
      }` +
      `${chairmanInfo.title_bn ? chairmanInfo.title_bn + " " : ""}` +
      `${chairmanInfo.first_name_bn} ${chairmanInfo.last_name_bn}`
    : "Loading chairman...";

  useEffect(() => {
    const generatePDF = async () => {
      const blob = await pdf(
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.section}>
              <View>
                <Text
                  style={[styles.text, { marginTop: "10px", fontSize: "14px" }]}
                >
                  {meetingInfo.department_name_bn} বিভাগ
                </Text>
              </View>
              <View
                style={{
                  marginTop: "18px",
                  border: "1px solid black",
                  marginLeft: "-16px",
                }}
              >
                <Text
                  style={{
                    paddingTop: "4px",
                    paddingLeft: "3px",
                    paddingRight: "2px",
                    fontSize: "9px",
                  }}
                >
                  "শিক্ষা নিয়ে গড়ব দেশ {"\n"} আলোকিত বাংলাদেশ"{" "}
                </Text>
              </View>
              <View>
                <Text style={{ fontSize: "12px", marginTop: "29px" }}>
                  চট্টগ্রাম বিশ্ববিদ্যালয়{"\n"}
                  <Text style={{ fontSize: "10px" }}>
                    চট্টগ্রাম, বাংলাদেশ {"\n"}
                  </Text>
                  <Text style={{ fontSize: "10px" }}>
                    তারিখঃ{" "}
                    {formatMeetingDateTime(meetingInfo.meeting_time).date()}
                  </Text>
                </Text>
              </View>
            </View>
            <View style={styles.text}>
              <View
                style={{
                  paddingLeft: "50px",
                  paddingRight: "30px",
                  marginTop: "30px",
                }}
              >
                <Text style={{ fontSize: "12px" }}>
                  {meetingInfo.department_name_bn} বিভাগের{" "}
                  {meetingInfo.meeting_type} কমিটির{" "}
                  {convertToBengaliNumber(meetingInfo.meeting_id)}তম সভা অদ্য{" "}
                  {formatMeetingDateTime(meetingInfo.meeting_time).date()}{" "}
                  তারিখ, {formatMeetingDateTime(meetingInfo.meeting_time).day()}
                  , বেলা{" "}
                  {formatMeetingDateTime(meetingInfo.meeting_time).time()}{" "}
                  ঘটিকায় {meetingInfo.room_name} অনুষ্ঠিত হয়। উক্ত সভায়
                  সভাপতিত্ব করেন অত্র বিভাগের সভাপতি {chairmanDisplayName}।
                  {"  "}
                </Text>
              </View>
              <View
                style={{
                  paddingLeft: "50px",
                  paddingRight: "30px",
                  marginTop: "6px",
                  fontSize: "12px",
                }}
              >
                <Text>সভায় নিম্নলিখিত সদস্যবৃন্দ উপস্থিত ছিলেনঃ</Text>
                {attendeeInfo.length > 0 ? (
                  attendeeInfo.map((attendee, index) => (
                    <Text key={attendee.user_id} style={{ textIndent: "2px" }}>
                      {convertToBengaliNumber(index + 1)}।{" "}
                      {formatFullAttendeeName(attendee)}, চ.বি.{" "}
                    </Text>
                  ))
                ) : (
                  <Text>Loading agenda...</Text>
                )}
              </View>
              <View
                style={{
                  paddingLeft: "50px",
                  paddingRight: "30px",
                  marginTop: "14px",
                  fontSize: "12px",
                }}
              >
                <Text>সভায় নিম্নলিখিত সিদ্ধান্তসমূহ গৃহীত হয়ঃ </Text>
                {agendaInfo.length > 0 ? (
                  agendaInfo.map((agenda, index) => (
                    <View
                      key={agenda.meeting_agenda_id}
                      style={{ marginBottom: "10px" }}
                    >
                      <Text style={{ textIndent: "2px" }}>
                        বিষয় {convertToBengaliNumber(index + 1)} :{" "}
                        {agenda.description}।{" "}
                      </Text>
                      <Text style={{ textIndent: "2px" }}>
                        সিদ্ধান্ত {convertToBengaliNumber(index + 1)}:{" "}
                        {agenda.decision}।{" "}
                      </Text>
                    </View>
                  ))
                ) : (
                  <Text>Loading agenda and decisions...</Text>
                )}
              </View>

              <View
                style={{
                  paddingLeft: "50px",
                  paddingRight: "30px",
                  fontSize: "12px",
                }}
              >
                <Text style={{ marginTop: "20px" }}>
                  সভায় আর কোন আলোচ্য বিষয় না থাকায় সভাপতি মহোদয় উপস্থিত সকলকে
                  ধন্যবাদ জানিয়ে সভার সমাপ্তি ঘোষনা করেন। {"    "}
                </Text>
                <Text style={{ marginTop: "45px" }}>
                  ({chairmanDisplayName}) {"   "}
                </Text>
                <Text>সভাপতি</Text>
                <Text>
                  {chairmanInfo
                    ? `${chairmanInfo.department_name_bn} বিভাগ`
                    : "Loading Department..."}{" "}
                </Text>
                <Text>চট্টগ্রাম বিশ্ববিদ্যালয়</Text>
              </View>
            </View>
          </Page>
        </Document>
      ).toBlob();

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64data = reader.result.split(",")[1];
        if (onComplete) {
          onComplete(base64data);
        }
      };
      reader.readAsDataURL(blob);
    };

    if (
      meetingInfo.meeting_time &&
      agendaInfo.length > 0 &&
      attendeeInfo.length > 0 &&
      chairmanInfo
    ) {
      generatePDF();
    }
  }, [meetingID, meetingInfo, agendaInfo, attendeeInfo, chairmanInfo, onComplete]);

  return null;
};

export default SaveMinutes;
