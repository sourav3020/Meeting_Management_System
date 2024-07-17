import  { useEffect, useState } from "react";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import thin from "../../../assets/fonts/TiroBangla-Regular.ttf";
// import Kalpurush from '../assets/fonts/Kalpurush/Kalpurush.ttf';

Font.register({ family: "TiroBangla", fonts: [{ src: thin }] });
// Font.register({ family: "Kalpurush", fonts: [{ src: Kalpurush }] });

const base_url = import.meta.env.VITE_API_URL;

const styles = StyleSheet.create({
  page: {
    backgroundColor: "white",
    fontFamily: "TiroBangla",
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

const FirstPDFFile = ({ meetingID }) => {
  const [meetingInfo, setMeetingInfo] = useState([]);
  const [agendaInfo, setAgendaInfo] = useState([]);
  const [attendeeInfo, setAttendeeInfo] = useState([]);

  useEffect(() => {
    async function fetchMeetingInfo() {
      try {
        const response = await fetch(
          `${base_url}/api/meeting/meetingInfo/${meetingID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setMeetingInfo(data[0]);
        }
      } catch (error) {
        console.error("Error fetching meeting info:", error);
      }
    }

    async function fetchAgendaInfo() {
      try {
        const response = await fetch(
          `${base_url}/api/meeting/agenda/${meetingID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAgendaInfo(data);
          //console.log('Agenda Info:', data);
        }
      } catch (error) {
        console.error("Error fetching agenda info:", error);
      }
    }

    async function fetchAttendeeInfo() {
      try {
        const response = await fetch(
          `${base_url}/api/meeting/attendees/${meetingID}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setAttendeeInfo(data);
          //console.log('Attendee Info:', data);
        }
      } catch (error) {
        console.error("Error fetching attendee info:", error);
      }
    }

    fetchMeetingInfo();
    fetchAgendaInfo();
    fetchAttendeeInfo();
  }, [meetingID]);

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
      return date.toLocaleTimeString("bn-BD", options);
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

  // Function to convert English numbers to Bengali
  function convertToBengaliNumber(number) {
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

    // Check if number is defined and convert each character to Bengali
    const convertedNumber = number
      ? number.toString().replace(/\d/g, (char) => bengaliNumbers[char])
      : "";

    return convertedNumber;
  };

  const formatAttendeeName = (attendee) => {
    const { title_bn, first_name_bn, last_name_bn, designation_bn } = attendee;

    let name = "";
    if (designation_bn === "অধ্যাপক" && designation_bn) {
      name += designation_bn + " ";
    }
    if (title_bn) {
      name += title_bn + " ";
    }
    name += first_name_bn + " " + last_name_bn + ", ";
    if (designation_bn !== "অধ্যাপক" && designation_bn) {
      name += designation_bn + ", ";
    }
    return name;
  };

  const formatFullAttendeeName = (attendee) => {
    let formattedName = formatAttendeeName(attendee);
    if (meetingInfo.department_name_bn === "কম্পিউটার সায়েন্স এন্ড ইঞ্জিনিয়ারিং") {
      formattedName += " সিএসই বিভাগ";
    }
    return formattedName;
  };


  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <View>
            <Text
              style={[styles.text, { marginTop: "10px", fontSize: "12px" }]}
            >
              {meetingInfo.department_name_bn} বিভাগ
            </Text>
          </View>
          <View style={{ marginTop: "18px", border: "1px solid black" }}>
            <Text
              style={{
                paddingTop: "4px",
                paddingLeft: "2px",
                paddingRight: "2px",
                fontSize: "7px",
              }}
            >
              "শিক্ষা নিয়ে গড়ব দেশ {"\n"}
              শেখ হাসিনার বাংলাদেশ"
            </Text>
          </View>
          <View>
            <Text style={{ fontSize: "10px", marginTop: "29px" }}>
              চট্টগ্রাম বিশ্ববিদ্যালয়{"\n"}
              <Text style={{ fontSize: "8px" }}>
                চট্টগ্রাম, বাংলাদেশ {"\n"}
              </Text>
              <Text style={{ fontSize: "8px" }}>
                তারিখঃ {formatMeetingDateTime(meetingInfo.meeting_time).date()}
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
            <Text
              style={{
                fontSize: "14px",
                textAlign: "center",
                textDecoration: "underline",
              }}
            >
              বিজ্ঞপ্তি
            </Text>
            <Text style={{ fontSize: "10px", marginTop: "5px" }}>
              সংশ্লিষ্ট  সকলের  অবগতির  জন্য  জানানো  যাচ্ছে  যে,  বিভাগীয় {" "}
               {meetingInfo.meeting_type}  কমিটির {" "} 
               {convertToBengaliNumber(meetingInfo.meeting_id)}তম  সভা  আগামী {" "}  
               {formatMeetingDateTime(meetingInfo.meeting_time).date()}  তারিখ,{" "}  
              {formatMeetingDateTime(meetingInfo.meeting_time).day()},  বেলা {" "}  
               {formatMeetingDateTime(meetingInfo.meeting_time).time()}  ঘটিকায়  
               বিভাগীয় {meetingInfo.room_name}  অনুষ্ঠিত  হবে ।  উক্ত  সভায়  সম্মানিত 
               সদস্যবৃন্দকে  উপস্থিত{" "}  থাকার  জন্য  অনুরোধ  করছি ।{"  "}
            </Text>
          </View>
          <View
            style={{
              paddingLeft: "50px",
              paddingRight: "30px",
              marginTop: "10px",
              fontSize: "10px",
            }}
          >
            <Text style={{ fontWeight: "bold", textDecoration: "underline" }}>
              আলোচ্যসূচীঃ{"  "}
            </Text>

            {agendaInfo.length > 0 ? (
              agendaInfo.map((agenda, index) => (
                <Text
                  key={agenda.meeting_agenda_id}
                  style={{ marginTop: "3px", textIndent: "2px" }}
                >
                  বিষয় {convertToBengaliNumber(index + 1)} :{" "}
                  {agenda.description} ।{" "}
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
              marginTop: "30px",
              fontSize: "10px",
            }}
          >
            <Text>ধন্যবাদান্তে </Text>
            <Text style={{ marginTop: "25px" }}>
              (অধ্যাপক ড. মুহাম্মদ সানাউল্লাহ চৌধুরী){" "}
            </Text>
            <Text>সভাপতি </Text>
            <Text>কম্পিউটার সায়েন্স এন্ড ইঞ্জিনিয়ারিং বিভাগ </Text>
            <Text>চট্টগ্রাম বিশ্ববিদ্যালয় </Text>
          </View>
          <View
            style={{
              paddingLeft: "50px",
              paddingRight: "30px",
              marginTop: "19px",
              fontSize: "10px",
            }}
          >
            <Text>
              অবগতি ও প্রয়োজনীয় ব্যবস্থা গ্রহণের জন্য অনুলিপি প্রেরিত হলঃ{" "}
            </Text>
            {attendeeInfo.length > 0 ? (
              attendeeInfo.map((attendee, index) => (
                <Text key={attendee.user_id} style={{ textIndent: "2px" }}>
                  {convertToBengaliNumber(index + 1)} । {formatFullAttendeeName(attendee)}, চ.বি.{" "}
                </Text>
              ))
            ) : (
              <Text>Loading attendee...</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
export default FirstPDFFile;
