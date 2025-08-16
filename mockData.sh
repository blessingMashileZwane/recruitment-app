#!/bin/bash

# Number of candidates (default = 10)
NUM_CANDIDATES=${1:-10}

OUTPUT_FILE="mock_candidates.csv"

# CSV header
echo "firstName,lastName,email,phone,currentLocation,citizenship,resumeUrl,status,university,qualification,proficiencyLevel,yearsOfExperience,appliedJob,applicationStatus" > $OUTPUT_FILE

# Arrays for random values
FIRST_NAMES=("Alice" "Bob" "Charlie" "Diana" "Ethan" "Fiona" "George" "Hannah" "Ian" "Julia")
LAST_NAMES=("Smith" "Johnson" "Williams" "Brown" "Jones" "Miller" "Davis" "Garcia" "Martinez" "Lopez")
LOCATIONS=("CPT" "JHB" "DBN" "PTA" "PE")
CITIZENSHIPS=("SA" "Namibia" "Zimbabwe" "Botswana" "Mozambique")
UNIVERSITIES=("UJ" "WITS" "UCT" "Stellenbosch" "NWU")
QUALIFICATIONS=("BSc" "BA" "BCom" "BEng" "LLB")
JOBS=("OPS" "FINANCE" "ACTUARIAL" "RECRUITMENT" "MARKETING" "ASSESSOR" "TECH" "OTHER")

generate_name() {
  # Generate a random name of length 3-8 with first letter uppercase
  length=$((RANDOM % 6 + 3))
  name=$(tr -dc 'a-z' < /dev/urandom | head -c $length)
  echo "$(tr '[:lower:]' '[:upper:]' <<< ${name:0:1})${name:1}"
}

for (( i=1; i<=NUM_CANDIDATES; i++ ))
do
  # Random selections
  firstName=$(generate_name)
  lastName=$(generate_name)
  email="${firstName,,}.${lastName,,}.$RANDOM@example.com"
  phone="0$((RANDOM % 900000000 + 100000000))"
  location=${LOCATIONS[$RANDOM % ${#LOCATIONS[@]}]}
  citizenship=${CITIZENSHIPS[$RANDOM % ${#CITIZENSHIPS[@]}]}
  resumeUrl="https://resume.example.com/${firstName,,}_${lastName,,}.pdf"
  status="OPEN"

  university=${UNIVERSITIES[$RANDOM % ${#UNIVERSITIES[@]}]}
  qualification=${QUALIFICATIONS[$RANDOM % ${#QUALIFICATIONS[@]}]}
  proficiencyLevel=$((RANDOM % 5 + 1)) # 1 to 5
  yearsOfExperience=$((RANDOM % 11))  # 0 to 10

  appliedJob=${JOBS[$RANDOM % ${#JOBS[@]}]}
  applicationStatus="ACTIVE"

  # Append row to CSV
  echo "$firstName,$lastName,$email,$phone,$location,$citizenship,$resumeUrl,$status,$university,$qualification,$proficiencyLevel,$yearsOfExperience,$appliedJob,$applicationStatus" >> $OUTPUT_FILE
done

echo "✅ Generated $NUM_CANDIDATES mock candidates in $OUTPUT_FILE"
